# Offline-First POS - Sync Strategy

This document explains the offline-first architecture for the Electric Store POS system, including data persistence, sync queue management, and conflict resolution.

## Overview

The POS system must work **reliably offline** because:
- Internet connectivity may be unreliable in retail locations
- POS operations cannot be blocked by network issues
- Sales must be recorded even during internet outages
- Customer experience must remain smooth regardless of connectivity

### Architecture Principles

1. **Local-First**: All operations write to IndexedDB first
2. **Optimistic UI**: UI updates immediately without waiting for server
3. **Background Sync**: Sync queue runs in background when online
4. **Conflict Resolution**: Last-write-wins with manual override for critical conflicts
5. **Data Integrity**: Ensure no data loss during offline/online transitions

---

## Data Flow

### Online Mode

```
User Action → Store Update → IndexedDB Write → API Call → Success/Failure Handler
                    ↓
                UI Update (Optimistic)
```

### Offline Mode

```
User Action → Store Update → IndexedDB Write → Sync Queue → UI Update
                                                      ↓
                                              (Sync when online)
```

---

## IndexedDB Schema

### Database Structure

```typescript
interface ElectricStoreDB extends DBSchema {
  // Product data
  products: {
    key: number;
    value: Product;
    indexes: { 'by-sku': string; 'by-barcode': string; 'by-branch': number };
  };

  // Sales transactions
  sales: {
    key: number;
    value: Sale;
    indexes: { 'by-date': Date; 'by-branch': number; 'by-synced': boolean };
  };

  // Customers
  customers: {
    key: number;
    value: Customer;
    indexes: { 'by-phone': string; 'by-email': string };
  };

  // Inventory adjustments
  inventoryAdjustments: {
    key: number;
    value: InventoryAdjustment;
    indexes: { 'by-date': Date; 'by-product': number; 'by-synced': boolean };
  };

  // Sync queue for pending operations
  syncQueue: {
    key: number;
    value: QueuedRequest;
    indexes: { 'by-timestamp': Date; 'by-status': string };
  };

  // Metadata
  metadata: {
    key: string;
    value: {
      lastSync: Date;
      serverVersion: number;
      localVersion: number;
    };
  };
}
```

### Implementation

`apps/samba-web/src/app/_infrastructure/services/storage/storage.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ElectricStoreDB extends DBSchema {
  products: {
    key: number;
    value: unknown;
    indexes: { 'by-sku': string; 'by-barcode': string; 'by-branch': number };
  };
  sales: {
    key: number;
    value: unknown;
    indexes: { 'by-date': Date; 'by-branch': number; 'by-synced': boolean };
  };
  customers: {
    key: number;
    value: unknown;
    indexes: { 'by-phone': string; 'by-email': string };
  };
  inventoryAdjustments: {
    key: number;
    value: unknown;
    indexes: { 'by-date': Date; 'by-product': number; 'by-synced': boolean };
  };
  syncQueue: {
    key: number;
    value: unknown;
    indexes: { 'by-timestamp': Date; 'by-status': string };
  };
  metadata: {
    key: string;
    value: unknown;
  };
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private db: IDBPDatabase<ElectricStoreDB> | null = null;
  private readonly DB_NAME = 'electric-store-db';
  private readonly DB_VERSION = 1;

  async init(): Promise<void> {
    this.db = await openDB<ElectricStoreDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Products store
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', {
            keyPath: 'id',
            autoIncrement: true,
          });
          productStore.createIndex('by-sku', 'sku', { unique: true });
          productStore.createIndex('by-barcode', 'barcode', { unique: false });
          productStore.createIndex('by-branch', 'branchId', { unique: false });
        }

        // Sales store
        if (!db.objectStoreNames.contains('sales')) {
          const salesStore = db.createObjectStore('sales', {
            keyPath: 'id',
            autoIncrement: true,
          });
          salesStore.createIndex('by-date', 'createdAt', { unique: false });
          salesStore.createIndex('by-branch', 'branchId', { unique: false });
          salesStore.createIndex('by-synced', 'synced', { unique: false });
        }

        // Customers store
        if (!db.objectStoreNames.contains('customers')) {
          const customerStore = db.createObjectStore('customers', {
            keyPath: 'id',
            autoIncrement: true,
          });
          customerStore.createIndex('by-phone', 'phone', { unique: false });
          customerStore.createIndex('by-email', 'email', { unique: false });
        }

        // Inventory adjustments store
        if (!db.objectStoreNames.contains('inventoryAdjustments')) {
          const invStore = db.createObjectStore('inventoryAdjustments', {
            keyPath: 'id',
            autoIncrement: true,
          });
          invStore.createIndex('by-date', 'createdAt', { unique: false });
          invStore.createIndex('by-product', 'productId', { unique: false });
          invStore.createIndex('by-synced', 'synced', { unique: false });
        }

        // Sync queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', {
            keyPath: 'id',
            autoIncrement: true,
          });
          syncStore.createIndex('by-timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('by-status', 'status', { unique: false });
        }

        // Metadata store
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      },
    });
  }

  async save<T>(storeName: keyof ElectricStoreDB, data: T): Promise<number> {
    if (!this.db) await this.init();
    return this.db!.add(storeName, data as any);
  }

  async getAll<T>(storeName: keyof ElectricStoreDB): Promise<T[]> {
    if (!this.db) await this.init();
    return this.db!.getAll(storeName) as Promise<T[]>;
  }

  async getById<T>(storeName: keyof ElectricStoreDB, id: number): Promise<T | undefined> {
    if (!this.db) await this.init();
    return this.db!.get(storeName, id) as Promise<T | undefined>;
  }

  async getByIndex<T>(
    storeName: keyof ElectricStoreDB,
    indexName: string,
    value: any
  ): Promise<T[]> {
    if (!this.db) await this.init();
    const tx = this.db!.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    return (await index.getAll(value)) as T[];
  }

  async update<T>(storeName: keyof ElectricStoreDB, data: T): Promise<number> {
    if (!this.db) await this.init();
    return this.db!.put(storeName, data as any);
  }

  async delete(storeName: keyof ElectricStoreDB, id: number): Promise<void> {
    if (!this.db) await this.init();
    return this.db!.delete(storeName, id);
  }

  async clear(storeName: keyof ElectricStoreDB): Promise<void> {
    if (!this.db) await this.init();
    return this.db!.clear(storeName);
  }

  async count(storeName: keyof ElectricStoreDB): Promise<number> {
    if (!this.db) await this.init();
    return this.db!.count(storeName);
  }
}
```

---

## Sync Queue Management

### Queue Item Structure

```typescript
interface QueuedRequest {
  id?: number;
  request: {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    body: unknown;
    headers: Record<string, string>;
  };
  entityType: 'sale' | 'inventory' | 'customer' | 'product';
  entityId: number;
  localId: number; // Temporary ID for offline-created entities
  timestamp: Date;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
  error?: string;
}
```

### Offline Service Implementation

`apps/samba-web/src/app/_infrastructure/services/offline/offline.service.ts`:

```typescript
import { HttpClient, HttpRequest } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, from, interval, of, switchMap, take } from 'rxjs';
import { StorageService } from '../storage/storage.service';

interface QueuedRequest {
  id?: number;
  request: {
    url: string;
    method: string;
    body: unknown;
    headers: Record<string, string>;
  };
  entityType: string;
  entityId: number;
  localId: number;
  timestamp: Date;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed' | 'completed';
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private storage = inject(StorageService);
  private http = inject(HttpClient);

  isOnline = signal(navigator.onLine);
  isSyncing = signal(false);
  syncProgress = signal({ total: 0, completed: 0 });

  constructor() {
    this.setupOnlineListener();
    this.startPeriodicSync();
  }

  private setupOnlineListener(): void {
    window.addEventListener('online', () => {
      this.isOnline.set(true);
      this.syncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline.set(false);
    });
  }

  private startPeriodicSync(): void {
    // Sync every 5 minutes when online
    interval(5 * 60 * 1000)
      .pipe(
        switchMap(() => {
          if (this.isOnline() && !this.isSyncing()) {
            return from(this.syncQueue());
          }
          return of(null);
        })
      )
      .subscribe();
  }

  async queueRequest(
    req: HttpRequest<unknown>,
    entityType: string,
    entityId: number,
    localId: number
  ): Promise<void> {
    const queuedRequest: QueuedRequest = {
      request: {
        url: req.url,
        method: req.method,
        body: req.body,
        headers: this.extractHeaders(req),
      },
      entityType,
      entityId,
      localId,
      timestamp: new Date(),
      retryCount: 0,
      status: 'pending',
    };

    await this.storage.save('syncQueue', queuedRequest);
  }

  async syncQueue(): Promise<void> {
    if (!this.isOnline() || this.isSyncing()) {
      return;
    }

    this.isSyncing.set(true);

    const pendingRequests = await this.storage.getByIndex<QueuedRequest>(
      'syncQueue',
      'by-status',
      'pending'
    );

    this.syncProgress.set({ total: pendingRequests.length, completed: 0 });

    for (const queuedReq of pendingRequests) {
      await this.processQueuedRequest(queuedReq);
    }

    this.isSyncing.set(false);
  }

  private async processQueuedRequest(queuedReq: QueuedRequest): Promise<void> {
    if (!queuedReq.id) return;

    try {
      // Update status to syncing
      await this.storage.update('syncQueue', { ...queuedReq, status: 'syncing' });

      // Execute request
      const result = await this.executeRequest(queuedReq);

      // Mark as completed
      await this.storage.update('syncQueue', {
        ...queuedReq,
        status: 'completed',
      });

      // Update local entity with server ID if needed
      if (result && result.id) {
        await this.updateLocalEntity(queuedReq.entityType, queuedReq.localId, result.id);
      }

      // Update progress
      const progress = this.syncProgress();
      this.syncProgress.set({
        total: progress.total,
        completed: progress.completed + 1,
      });
    } catch (error: any) {
      // Update retry count and status
      const updatedRequest = {
        ...queuedReq,
        retryCount: queuedReq.retryCount + 1,
        status: queuedReq.retryCount >= 3 ? ('failed' as const) : ('pending' as const),
        error: error.message,
      };

      await this.storage.update('syncQueue', updatedRequest);
    }
  }

  private async executeRequest(queuedReq: QueuedRequest): Promise<any> {
    const { url, method, body, headers } = queuedReq.request;

    return this.http
      .request(method, url, { body, headers })
      .pipe(
        take(1),
        catchError(error => {
          throw error;
        })
      )
      .toPromise();
  }

  private async updateLocalEntity(
    entityType: string,
    localId: number,
    serverId: number
  ): Promise<void> {
    const storeName = this.getStoreName(entityType);
    const entity = await this.storage.getById(storeName, localId);

    if (entity) {
      await this.storage.update(storeName, {
        ...(entity as object),
        id: serverId,
        synced: true,
      });
    }
  }

  private getStoreName(entityType: string): keyof import('../storage/storage.service').ElectricStoreDB {
    const mapping: Record<string, string> = {
      sale: 'sales',
      inventory: 'inventoryAdjustments',
      customer: 'customers',
      product: 'products',
    };
    return mapping[entityType] as any;
  }

  async getQueuedRequests(): Promise<QueuedRequest[]> {
    return this.storage.getAll<QueuedRequest>('syncQueue');
  }

  async getFailedRequests(): Promise<QueuedRequest[]> {
    return this.storage.getByIndex<QueuedRequest>('syncQueue', 'by-status', 'failed');
  }

  async retryFailedRequest(id: number): Promise<void> {
    const request = await this.storage.getById<QueuedRequest>('syncQueue', id);
    if (request) {
      await this.storage.update('syncQueue', {
        ...request,
        status: 'pending',
        retryCount: 0,
      });
      await this.syncQueue();
    }
  }

  async clearQueue(): Promise<void> {
    await this.storage.clear('syncQueue');
  }

  private extractHeaders(req: HttpRequest<unknown>): Record<string, string> {
    const headers: Record<string, string> = {};
    req.headers.keys().forEach(key => {
      const value = req.headers.get(key);
      if (value) {
        headers[key] = value;
      }
    });
    return headers;
  }
}
```

---

## POS Offline Workflow

### Creating a Sale Offline

#### Step 1: User Adds Items to Cart

```typescript
// POS component
cartStore.addItem(product, quantity);
```

#### Step 2: User Completes Sale

```typescript
// POS component
async completeSale(): Promise<void> {
  const sale: Sale = {
    id: Date.now(), // Temporary local ID
    branchId: this.branchStore.selectedBranchId()!,
    userId: this.authStore.user()!.id,
    items: this.cartStore.items(),
    subtotal: this.cartStore.subtotal(),
    tax: this.cartStore.taxAmount(),
    discount: this.cartStore.discountAmount(),
    total: this.cartStore.total(),
    paymentMethod: this.selectedPaymentMethod,
    createdAt: new Date(),
    synced: false, // Mark as not synced
  };

  // Save to IndexedDB
  await this.storage.save('sales', sale);

  // Update product stock locally
  for (const item of sale.items) {
    await this.updateProductStock(item.product.id, -item.quantity);
  }

  // Queue for sync
  if (!this.offlineService.isOnline()) {
    await this.offlineService.queueRequest(
      this.createSaleRequest(sale),
      'sale',
      sale.id,
      sale.id
    );
  } else {
    // Try to sync immediately
    try {
      const result = await this.saleService.create(sale).toPromise();
      await this.storage.update('sales', { ...sale, id: result.id, synced: true });
    } catch {
      // Queue if online request fails
      await this.offlineService.queueRequest(
        this.createSaleRequest(sale),
        'sale',
        sale.id,
        sale.id
      );
    }
  }

  // Clear cart
  this.cartStore.clearCart();

  // Show receipt
  this.showReceipt(sale);
}
```

---

## Conflict Resolution

### Conflict Types

1. **Product Stock Conflicts**
   - Local: Stock reduced by 5
   - Server: Stock reduced by 3
   - **Resolution**: Use server value + queue local adjustment

2. **Price Changes**
   - Local sale created with old price
   - Server price updated
   - **Resolution**: Honor sale price at transaction time

3. **Deleted Entities**
   - Local: Update queued for product
   - Server: Product deleted
   - **Resolution**: Mark local update as failed, notify user

### Conflict Resolution Strategy

```typescript
interface ConflictResolution {
  entityType: string;
  entityId: number;
  localVersion: unknown;
  serverVersion: unknown;
  resolution: 'use-local' | 'use-server' | 'manual';
  resolvedAt?: Date;
}

async resolveConflict(conflict: ConflictResolution): Promise<void> {
  switch (conflict.resolution) {
    case 'use-local':
      // Force update server with local version
      await this.forceServerUpdate(conflict);
      break;

    case 'use-server':
      // Overwrite local with server version
      await this.forceLocalUpdate(conflict);
      break;

    case 'manual':
      // Show conflict resolution UI
      await this.showConflictUI(conflict);
      break;
  }
}
```

---

## Data Synchronization Rules

### Rule 1: Sales Are Immutable

Once a sale is created, it cannot be modified. Only new adjustments/refunds can be created.

**Benefit**: No conflicts on sale data.

### Rule 2: Product Stock Uses Delta Sync

Instead of syncing absolute stock values, sync stock adjustments:

```typescript
interface StockAdjustment {
  productId: number;
  delta: number; // +5 or -3
  reason: 'sale' | 'purchase' | 'adjustment' | 'transfer';
  timestamp: Date;
}
```

**Benefit**: Multiple offline devices can sync stock changes without conflicts.

### Rule 3: Last-Write-Wins for Master Data

Product prices, customer info, etc. use last-write-wins:

```typescript
if (localUpdatedAt > serverUpdatedAt) {
  // Use local version
} else {
  // Use server version
}
```

---

## Periodic Background Sync

### Service Worker Integration

Register background sync when user creates sale offline:

```typescript
// Register sync event
if ('serviceWorker' in navigator && 'sync' in (self as any).registration) {
  (self as any).registration.sync.register('sync-sales');
}

// Service worker sync handler
self.addEventListener('sync', (event: any) => {
  if (event.tag === 'sync-sales') {
    event.waitUntil(syncPendingSales());
  }
});
```

---

## User Feedback

### Sync Status Indicator

Show sync status in UI:

```html
<!-- Sync status component -->
<div class="sync-status">
  @if (offlineService.isOnline()) {
    <span class="badge badge-success">Online</span>
  } @else {
    <span class="badge badge-warning">Offline</span>
  }

  @if (offlineService.isSyncing()) {
    <span class="badge badge-info">
      Syncing {{ offlineService.syncProgress().completed }} / {{ offlineService.syncProgress().total }}
    </span>
  }
</div>
```

### Failed Sync Notification

Alert users to failed syncs:

```typescript
async checkFailedSyncs(): Promise<void> {
  const failedRequests = await this.offlineService.getFailedRequests();

  if (failedRequests.length > 0) {
    this.notificationService.warning(
      `${failedRequests.length} transactions failed to sync. Please check sync queue.`
    );
  }
}
```

---

## Testing Offline Mode

### Simulate Offline Mode

```typescript
// In Chrome DevTools: Network tab → Throttling → Offline

// Or programmatically:
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.controller?.postMessage({
    type: 'SIMULATE_OFFLINE',
  });
}
```

### Test Scenarios

1. **Create sale while offline** → Verify stored in IndexedDB → Go online → Verify synced
2. **Multiple offline sales** → Verify all queued → Verify all synced in order
3. **Offline product search** → Verify reads from IndexedDB
4. **Offline stock update** → Verify queued → Verify applied on sync
5. **Conflict resolution** → Create conflict → Verify resolution strategy

---

## Performance Considerations

### IndexedDB Query Optimization

Use indexes for frequent queries:

```typescript
// Query by barcode (indexed)
const product = await storage.getByIndex('products', 'by-barcode', barcode);

// Query unsynced sales (indexed)
const unsyncedSales = await storage.getByIndex('sales', 'by-synced', false);
```

### Batch Operations

Sync multiple requests in a single batch:

```typescript
async syncBatch(requests: QueuedRequest[]): Promise<void> {
  const batchRequest = {
    operations: requests.map(r => r.request),
  };

  await this.http.post('/api/batch', batchRequest).toPromise();
}
```

---

## Conclusion

This offline-first architecture ensures:
- ✅ POS operations never blocked by network issues
- ✅ Data integrity maintained during offline/online transitions
- ✅ Automatic background sync with conflict resolution
- ✅ Excellent user experience regardless of connectivity

---

## Additional Resources

- [IndexedDB API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)
- [Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Sync_API)
- [idb Library Documentation](https://github.com/jakearchibald/idb)
- [DDD-ARCHITECTURE.md](./DDD-ARCHITECTURE.md)
- [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)
