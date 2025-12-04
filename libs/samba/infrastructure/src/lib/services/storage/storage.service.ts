import { Injectable } from '@angular/core';

/**
 * IndexedDB Storage Service for offline-first POS
 *
 * Note: For a cleaner API, consider installing `idb` library:
 * npm install idb
 *
 * This implementation uses native IndexedDB API.
 */

export type StoreName = 'products' | 'sales' | 'customers' | 'inventoryAdjustments' | 'syncQueue' | 'metadata';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'electric-store-db';
  private readonly DB_VERSION = 1;

  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Products store
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', {
            keyPath: 'id',
            autoIncrement: true,
          });
          productStore.createIndex('by-sku', 'sku', { unique: false });
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
      };
    });
  }

  async save<T>(storeName: StoreName, data: T): Promise<number> {
    await this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => {
        resolve(request.result as number);
      };

      request.onerror = () => {
        reject(new Error(`Failed to save to ${storeName}`));
      };
    });
  }

  async getAll<T>(storeName: StoreName): Promise<T[]> {
    await this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result as T[]);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get all from ${storeName}`));
      };
    });
  }

  async getById<T>(storeName: StoreName, id: number): Promise<T | undefined> {
    await this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result as T | undefined);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get from ${storeName}`));
      };
    });
  }

  async getByIndex<T>(
    storeName: StoreName,
    indexName: string,
    value: IDBValidKey | IDBKeyRange | null | undefined
  ): Promise<T[]> {
    await this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => {
        resolve(request.result as T[]);
      };

      request.onerror = () => {
        reject(new Error(`Failed to get from index ${indexName} in ${storeName}`));
      };
    });
  }

  async update<T>(storeName: StoreName, data: T): Promise<number> {
    await this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => {
        resolve(request.result as number);
      };

      request.onerror = () => {
        reject(new Error(`Failed to update in ${storeName}`));
      };
    });
  }

  async delete(storeName: StoreName, id: number): Promise<void> {
    await this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to delete from ${storeName}`));
      };
    });
  }

  async clear(storeName: StoreName): Promise<void> {
    await this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(new Error(`Failed to clear ${storeName}`));
      };
    });
  }

  async count(storeName: StoreName): Promise<number> {
    await this.ensureDb();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject(new Error(`Failed to count in ${storeName}`));
      };
    });
  }

  private async ensureDb(): Promise<void> {
    if (!this.db) {
      await this.init();
    }
  }
}
