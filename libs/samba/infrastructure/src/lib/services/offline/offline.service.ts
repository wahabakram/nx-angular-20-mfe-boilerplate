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
      if (result && typeof result === 'object' && 'id' in result && typeof result.id === 'number') {
        await this.updateLocalEntity(queuedReq.entityType, queuedReq.localId, result.id);
      }

      // Update progress
      const progress = this.syncProgress();
      this.syncProgress.set({
        total: progress.total,
        completed: progress.completed + 1,
      });
    } catch (error: unknown) {
      // Update retry count and status
      const updatedRequest = {
        ...queuedReq,
        retryCount: queuedReq.retryCount + 1,
        status: queuedReq.retryCount >= 3 ? ('failed' as const) : ('pending' as const),
        error: error instanceof Error ? error.message : 'Unknown error',
      };

      await this.storage.update('syncQueue', updatedRequest);
    }
  }

  private async executeRequest(queuedReq: QueuedRequest): Promise<unknown> {
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
    if (!storeName) return;

    const entity = await this.storage.getById(storeName, localId);

    if (entity) {
      await this.storage.update(storeName, {
        ...(entity as object),
        id: serverId,
        synced: true,
      });
    }
  }

  private getStoreName(entityType: string): StoreName | null {
    const mapping: Record<string, StoreName> = {
      sale: 'sales',
      inventory: 'inventoryAdjustments',
      customer: 'customers',
      product: 'products',
    };
    return mapping[entityType] || null;
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

// Type alias for storage names
type StoreName = 'products' | 'sales' | 'customers' | 'inventoryAdjustments' | 'syncQueue' | 'metadata';
