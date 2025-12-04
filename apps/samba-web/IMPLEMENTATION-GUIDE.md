# Electric Store POS & Inventory - Implementation Guide

This guide provides step-by-step instructions for implementing the Electric Store POS & Inventory Management System in the samba-web app.

## Implementation Progress

### ✅ Week 1: Foundation & Setup (COMPLETED)

**Completed Tasks:**
- ✅ Task 1: Clean up samba-web app (removed NxWelcome placeholder)
- ✅ Task 2: Create DDD folder structure (28 directories)
- ✅ Task 3: Create documentation files (5 guides + 2 standards)
- ✅ Task 4: Create domain models in app structure (7 domains: Product, Branch, User/Auth, Sale, Customer, Category, Inventory)
- ✅ Task 5: Create infrastructure guards (auth, role, branch)
- ✅ Task 6: Create infrastructure interceptors (auth, offline)
- ✅ Task 7: Create infrastructure services (API, Storage with IndexedDB, Offline sync)
- ✅ Task 8: Set up mock API server (json-server with sample data)
- ✅ Task 9: Configure environment files (development & production)

**Note:** Domain models were created **directly in the app structure** (`apps/samba-web/src/app/_domain/`) instead of separate NX libraries. This is the recommended approach for MVP to keep things simple. Libraries can be extracted later if needed for Module Federation migration.

### 📋 Week 2-3: Authentication & POS (TODO)
### 📋 Week 4-5: Inventory Management (TODO)
### 📋 Week 6-7: Sales & Reports (TODO)

---

## Prerequisites

- Review [DDD-ARCHITECTURE.md](./DDD-ARCHITECTURE.md) to understand the architecture
- Review [ANGULAR-20-BEST-PRACTICES.md](../../ANGULAR-20-BEST-PRACTICES.md) for coding standards
- Review [COMPONENT-MAPPING.md](../../COMPONENT-MAPPING.md) for available components

## Project Structure

```
apps/samba-web/src/app/
├── _domain/              # Domain models, stores, and business logic
│   ├── product/         # ✅ Product domain (model, store, service)
│   ├── branch/          # ✅ Branch domain (model, store, service)
│   ├── user/            # ✅ User/Auth domain (model, store, service)
│   ├── sale/            # ✅ Sale domain (model, store, service)
│   ├── customer/        # ✅ Customer domain (model, store, service)
│   ├── category/        # ✅ Category domain (model, store, service)
│   └── inventory/       # ✅ Inventory domain (model, store, service)
├── _infrastructure/      # Guards, interceptors, services
│   ├── guards/          # ✅ auth.guard, role.guard, branch.guard
│   ├── interceptors/    # ✅ auth.interceptor, offline.interceptor
│   └── services/        # ✅ api.service, storage.service, offline.service
├── _shared/              # Shared UI components and layouts (TODO)
└── features/             # Feature modules (auth, pos, inventory, etc.) (TODO)
```

---

## Week 1: Foundation & Setup ✅ COMPLETED

### Task 1: Clean Up Samba-Web App ✅ COMPLETED

Removed NxWelcome placeholder component.

**Files Modified:**
- [apps/samba-web/src/app/app.ts](src/app/app.ts)
- [apps/samba-web/src/app/app.html](src/app/app.html)
- [apps/samba-web/src/app/app.routes.ts](src/app/app.routes.ts)

**Files Deleted:**
- `apps/samba-web/src/app/nx-welcome.ts`

---

### Task 2: Create DDD Folder Structure ✅ COMPLETED

Created 28 directories with proper DDD structure.

**Folders Created:**
```
_domain/
├── product/{models,store,services}
├── branch/{models,store,services}
├── user/{models,store,services}
├── sale/{models,store,services}
├── customer/{models,store,services}
├── category/{models,store,services}
├── inventory/{models,store,services}
├── quotation/{models,store,services}
└── supplier/{models,store,services}

_infrastructure/
├── guards/
├── interceptors/
└── services/{api,storage,offline,mock}

_shared/
├── layouts/
├── components/
├── directives/
└── pipes/

features/
├── auth/
├── pos/
├── inventory/
├── sales/
├── reports/
└── settings/
```

---

### Task 3: Create Documentation Files ✅ COMPLETED

**Documentation Created:**
- ✅ [ANGULAR-20-BEST-PRACTICES.md](../../ANGULAR-20-BEST-PRACTICES.md) - Workspace-wide coding standards
- ✅ [COMPONENT-MAPPING.md](../../COMPONENT-MAPPING.md) - Catalog of 70+ reusable components
- ✅ [DDD-ARCHITECTURE.md](./DDD-ARCHITECTURE.md) - DDD architecture guide with examples
- ✅ [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md) - This file
- ✅ [MODULE-FEDERATION-MIGRATION.md](./MODULE-FEDERATION-MIGRATION.md) - Future migration guide
- ✅ [OFFLINE-SYNC-STRATEGY.md](./OFFLINE-SYNC-STRATEGY.md) - Offline-first architecture
- ✅ [MULTI-BRANCH-GUIDE.md](./MULTI-BRANCH-GUIDE.md) - Multi-branch system architecture

---

### Task 4: Create Domain Models ✅ COMPLETED

**Approach:** Domain models created **directly in app structure** (`apps/samba-web/src/app/_domain/`) instead of separate NX libraries for MVP simplicity.

> **Note:** The guide below shows how to generate NX libraries if needed in the future (e.g., for Module Federation migration). For now, all domain files are already created in the app.

#### Option A: Generate NX Libraries (For Future Module Federation)

Generate libraries for each domain entity using NX generators.

#### 4.1 Generate Product Domain Library

```bash
# Generate product domain library
npx nx g @nx/angular:library product-domain \
  --directory=libs/samba/domain/product \
  --importPath=@samba/product-domain \
  --standalone \
  --no-interactive

# Generate models, stores, and services
npx nx g @nx/angular:service product \
  --project=product-domain \
  --path=libs/samba/domain/product/src/lib/services

npx nx g @nx/angular:interface product \
  --project=product-domain \
  --path=libs/samba/domain/product/src/lib/models \
  --type=model
```

**Or manually create files in app structure:**

Create `apps/samba-web/src/app/_domain/product/models/product.model.ts`:

```typescript
export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  costPrice: number;
  categoryId: number;
  supplierId?: number;
  status: ProductStatus;
  stockLevel: number;
  lowStockThreshold: number;
  reorderPoint: number;
  maxStockLevel: number;
  unit: string; // 'piece', 'box', 'kg', etc.
  description?: string;
  imageUrl?: string;
  branchId: number; // Multi-branch support
  createdAt: Date;
  updatedAt: Date;
}

export type ProductStatus = 'active' | 'inactive' | 'discontinued';

export interface CreateProductDto {
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  costPrice: number;
  categoryId: number;
  supplierId?: number;
  status: ProductStatus;
  stockLevel: number;
  lowStockThreshold: number;
  reorderPoint: number;
  maxStockLevel: number;
  unit: string;
  description?: string;
  imageUrl?: string;
  branchId: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  id: number;
}

export interface ProductFilter {
  search?: string;
  categoryId?: number;
  status?: ProductStatus;
  branchId?: number;
  lowStock?: boolean;
}
```

Create `apps/samba-web/src/app/_domain/product/store/product.store.ts`:

```typescript
import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Product, ProductFilter } from '../models/product.model';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  filter: ProductFilter;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  filter: {},
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    filteredProducts: computed(() => {
      const filter = store.filter();
      let products = store.products();

      if (filter.search) {
        const search = filter.search.toLowerCase();
        products = products.filter(
          p => p.name.toLowerCase().includes(search) ||
               p.sku.toLowerCase().includes(search) ||
               p.barcode?.toLowerCase().includes(search)
        );
      }

      if (filter.categoryId) {
        products = products.filter(p => p.categoryId === filter.categoryId);
      }

      if (filter.status) {
        products = products.filter(p => p.status === filter.status);
      }

      if (filter.branchId) {
        products = products.filter(p => p.branchId === filter.branchId);
      }

      if (filter.lowStock) {
        products = products.filter(p => p.stockLevel <= p.lowStockThreshold);
      }

      return products;
    }),

    lowStockProducts: computed(() => {
      return store.products().filter(p => p.stockLevel <= p.lowStockThreshold);
    }),

    totalProducts: computed(() => store.products().length),

    activeProducts: computed(() => {
      return store.products().filter(p => p.status === 'active');
    }),
  })),
  withMethods((store) => ({
    setProducts(products: Product[]): void {
      patchState(store, { products, error: null });
    },

    addProduct(product: Product): void {
      patchState(store, (state) => ({
        products: [...state.products, product],
      }));
    },

    updateProduct(product: Product): void {
      patchState(store, (state) => ({
        products: state.products.map(p => p.id === product.id ? product : p),
      }));
    },

    deleteProduct(id: number): void {
      patchState(store, (state) => ({
        products: state.products.filter(p => p.id !== id),
      }));
    },

    selectProduct(product: Product | null): void {
      patchState(store, { selectedProduct: product });
    },

    setFilter(filter: ProductFilter): void {
      patchState(store, { filter });
    },

    clearFilter(): void {
      patchState(store, { filter: {} });
    },

    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },

    setError(error: string | null): void {
      patchState(store, { error });
    },

    updateStock(productId: number, quantity: number): void {
      patchState(store, (state) => ({
        products: state.products.map(p =>
          p.id === productId
            ? { ...p, stockLevel: p.stockLevel + quantity }
            : p
        ),
      }));
    },
  }))
);
```

Create `apps/samba-web/src/app/_domain/product/services/product.service.ts`:

```typescript
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../_infrastructure/services/api/api.service';
import { CreateProductDto, Product, UpdateProductDto } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiService = inject(ApiService);
  private readonly endpoint = '/products';

  getAll(): Observable<Product[]> {
    return this.apiService.get<Product[]>(this.endpoint);
  }

  getById(id: number): Observable<Product> {
    return this.apiService.get<Product>(`${this.endpoint}/${id}`);
  }

  getByBranch(branchId: number): Observable<Product[]> {
    return this.apiService.get<Product[]>(`${this.endpoint}?branchId=${branchId}`);
  }

  create(dto: CreateProductDto): Observable<Product> {
    return this.apiService.post<Product>(this.endpoint, dto);
  }

  update(dto: UpdateProductDto): Observable<Product> {
    return this.apiService.put<Product>(`${this.endpoint}/${dto.id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  searchByBarcode(barcode: string): Observable<Product | null> {
    return this.apiService.get<Product | null>(`${this.endpoint}/barcode/${barcode}`);
  }

  getLowStockProducts(branchId?: number): Observable<Product[]> {
    const url = branchId
      ? `${this.endpoint}/low-stock?branchId=${branchId}`
      : `${this.endpoint}/low-stock`;
    return this.apiService.get<Product[]>(url);
  }
}
```

#### 4.2 Generate Branch Domain Library

Create `apps/samba-web/src/app/_domain/branch/models/branch.model.ts`:

```typescript
export interface Branch {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  isMainBranch: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBranchDto {
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  isMainBranch: boolean;
  isActive: boolean;
}

export interface UpdateBranchDto extends Partial<CreateBranchDto> {
  id: number;
}
```

Create `apps/samba-web/src/app/_domain/branch/store/branch.store.ts`:

```typescript
import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Branch } from '../models/branch.model';

interface BranchState {
  branches: Branch[];
  selectedBranchId: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BranchState = {
  branches: [],
  selectedBranchId: null,
  isLoading: false,
  error: null,
};

export const BranchStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    activeBranches: computed(() => {
      return store.branches().filter(b => b.isActive);
    }),

    selectedBranch: computed(() => {
      const id = store.selectedBranchId();
      return store.branches().find(b => b.id === id) ?? null;
    }),

    mainBranch: computed(() => {
      return store.branches().find(b => b.isMainBranch) ?? null;
    }),
  })),
  withMethods((store) => ({
    setBranches(branches: Branch[]): void {
      patchState(store, { branches, error: null });
    },

    selectBranch(branchId: number | null): void {
      patchState(store, { selectedBranchId: branchId });
    },

    addBranch(branch: Branch): void {
      patchState(store, (state) => ({
        branches: [...state.branches, branch],
      }));
    },

    updateBranch(branch: Branch): void {
      patchState(store, (state) => ({
        branches: state.branches.map(b => b.id === branch.id ? branch : b),
      }));
    },

    deleteBranch(id: number): void {
      patchState(store, (state) => ({
        branches: state.branches.filter(b => b.id !== id),
      }));
    },

    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },

    setError(error: string | null): void {
      patchState(store, { error });
    },
  }))
);
```

#### 4.3 Generate User/Auth Domain Library

Create `apps/samba-web/src/app/_domain/user/models/user.model.ts`:

```typescript
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  branchId: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'manager' | 'cashier';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface CreateUserDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  branchId: number;
  isActive: boolean;
}

export interface UpdateUserDto extends Partial<Omit<CreateUserDto, 'password'>> {
  id: number;
}
```

Create `apps/samba-web/src/app/_domain/user/store/auth.store.ts`:

```typescript
import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { User, UserRole } from '../models/user.model';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    userRole: computed(() => store.user()?.role ?? null),

    isAdmin: computed(() => store.user()?.role === 'admin'),

    isManager: computed(() => store.user()?.role === 'manager'),

    isCashier: computed(() => store.user()?.role === 'cashier'),

    hasRole: computed(() => (role: UserRole) => store.user()?.role === role),

    canManageInventory: computed(() => {
      const role = store.user()?.role;
      return role === 'admin' || role === 'manager';
    }),

    canManageUsers: computed(() => store.user()?.role === 'admin'),
  })),
  withMethods((store) => ({
    login(user: User, token: string): void {
      patchState(store, {
        user,
        token,
        isAuthenticated: true,
        error: null,
      });
    },

    logout(): void {
      patchState(store, {
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      });
    },

    updateUser(user: User): void {
      patchState(store, { user });
    },

    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },

    setError(error: string | null): void {
      patchState(store, { error });
    },
  }))
);
```

#### 4.4 Generate Remaining Domain Libraries

Follow the same pattern for:
- **Inventory** (`_domain/inventory/`)
- **Sale** (`_domain/sale/`)
- **Customer** (`_domain/customer/`)
- **Quotation** (`_domain/quotation/`)
- **Supplier** (`_domain/supplier/`)
- **Category** (`_domain/category/`)

Each domain should have:
- `models/` - TypeScript interfaces
- `store/` - NgRx Signal Store
- `services/` - Business logic services

---

## Week 2: Infrastructure Layer

### Task 5: Create Guards

Create `apps/samba-web/src/app/_infrastructure/guards/auth.guard.ts`:

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../_domain/user/store/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
};
```

Create `apps/samba-web/src/app/_infrastructure/guards/role.guard.ts`:

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../../_domain/user/store/auth.store';
import { UserRole } from '../../_domain/user/models/user.model';

export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return (route, state) => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (!authStore.isAuthenticated()) {
      return router.createUrlTree(['/auth/login']);
    }

    const userRole = authStore.userRole();
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }

    return router.createUrlTree(['/unauthorized']);
  };
}
```

### Task 6: Create Interceptors

Create `apps/samba-web/src/app/_infrastructure/interceptors/auth.interceptor.ts`:

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../../_domain/user/store/auth.store';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const token = authStore.token();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req);
};
```

Create `apps/samba-web/src/app/_infrastructure/interceptors/offline.interceptor.ts`:

```typescript
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { OfflineService } from '../services/offline/offline.service';

export const offlineInterceptor: HttpInterceptorFn = (req, next) => {
  const offlineService = inject(OfflineService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!navigator.onLine || error.status === 0) {
        // Queue request for later sync
        offlineService.queueRequest(req);

        return throwError(() => new Error('Application is offline. Request queued for sync.'));
      }

      return throwError(() => error);
    })
  );
};
```

### Task 7: Create Infrastructure Services

Create `apps/samba-web/src/app/_infrastructure/services/api/api.service.ts`:

```typescript
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`);
  }

  post<T>(endpoint: string, data: unknown): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, data);
  }

  put<T>(endpoint: string, data: unknown): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, data);
  }

  patch<T>(endpoint: string, data: unknown): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${endpoint}`, data);
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`);
  }
}
```

Create `apps/samba-web/src/app/_infrastructure/services/storage/storage.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ElectricStoreDB extends DBSchema {
  products: {
    key: number;
    value: unknown;
    indexes: { 'by-sku': string; 'by-barcode': string };
  };
  sales: {
    key: number;
    value: unknown;
  };
  customers: {
    key: number;
    value: unknown;
  };
  syncQueue: {
    key: number;
    value: unknown;
  };
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private db: IDBPDatabase<ElectricStoreDB> | null = null;

  async init(): Promise<void> {
    this.db = await openDB<ElectricStoreDB>('electric-store-db', 1, {
      upgrade(db) {
        // Products store
        const productStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
        productStore.createIndex('by-sku', 'sku', { unique: true });
        productStore.createIndex('by-barcode', 'barcode', { unique: false });

        // Sales store
        db.createObjectStore('sales', { keyPath: 'id', autoIncrement: true });

        // Customers store
        db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });

        // Sync queue store
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
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
}
```

Create `apps/samba-web/src/app/_infrastructure/services/offline/offline.service.ts`:

```typescript
import { HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { StorageService } from '../storage/storage.service';

interface QueuedRequest {
  id?: number;
  request: {
    url: string;
    method: string;
    body: unknown;
    headers: Record<string, string>;
  };
  timestamp: Date;
  retryCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  private storage = inject(StorageService);

  async queueRequest(req: HttpRequest<unknown>): Promise<void> {
    const queuedRequest: QueuedRequest = {
      request: {
        url: req.url,
        method: req.method,
        body: req.body,
        headers: this.extractHeaders(req),
      },
      timestamp: new Date(),
      retryCount: 0,
    };

    await this.storage.save('syncQueue', queuedRequest);
  }

  async getQueuedRequests(): Promise<QueuedRequest[]> {
    return this.storage.getAll<QueuedRequest>('syncQueue');
  }

  async removeFromQueue(id: number): Promise<void> {
    await this.storage.delete('syncQueue', id);
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

### Task 8: Set Up Mock API Server

Install json-server:

```bash
npm install --save-dev json-server
```

Create `apps/samba-web/mock-api/db.json`:

```json
{
  "products": [
    {
      "id": 1,
      "name": "LED TV 55 inch",
      "sku": "TV-LED-55-001",
      "barcode": "1234567890123",
      "price": 45000,
      "costPrice": 38000,
      "categoryId": 1,
      "supplierId": 1,
      "status": "active",
      "stockLevel": 15,
      "lowStockThreshold": 5,
      "reorderPoint": 10,
      "maxStockLevel": 50,
      "unit": "piece",
      "description": "55 inch LED Smart TV with 4K resolution",
      "imageUrl": null,
      "branchId": 1,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Washing Machine 7kg",
      "sku": "WM-AUTO-7KG-001",
      "barcode": "1234567890124",
      "price": 28000,
      "costPrice": 23000,
      "categoryId": 2,
      "supplierId": 1,
      "status": "active",
      "stockLevel": 3,
      "lowStockThreshold": 5,
      "reorderPoint": 8,
      "maxStockLevel": 30,
      "unit": "piece",
      "description": "7kg Automatic Washing Machine",
      "imageUrl": null,
      "branchId": 1,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "categories": [
    {
      "id": 1,
      "name": "Televisions",
      "code": "TV",
      "description": "All types of televisions",
      "isActive": true
    },
    {
      "id": 2,
      "name": "Home Appliances",
      "code": "HA",
      "description": "Washing machines, refrigerators, etc.",
      "isActive": true
    }
  ],
  "branches": [
    {
      "id": 1,
      "name": "Main Branch",
      "code": "MAIN",
      "address": "123 Main Street",
      "city": "Karachi",
      "phone": "+92-21-1234567",
      "email": "main@electricstore.com",
      "isMainBranch": true,
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "name": "North Branch",
      "code": "NORTH",
      "address": "456 North Avenue",
      "city": "Lahore",
      "phone": "+92-42-1234567",
      "email": "north@electricstore.com",
      "isMainBranch": false,
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "users": [
    {
      "id": 1,
      "username": "admin",
      "email": "admin@electricstore.com",
      "firstName": "System",
      "lastName": "Administrator",
      "role": "admin",
      "branchId": 1,
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "username": "manager1",
      "email": "manager@electricstore.com",
      "firstName": "Branch",
      "lastName": "Manager",
      "role": "manager",
      "branchId": 1,
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    {
      "id": 3,
      "username": "cashier1",
      "email": "cashier@electricstore.com",
      "firstName": "Store",
      "lastName": "Cashier",
      "role": "cashier",
      "branchId": 1,
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  "sales": [],
  "customers": [],
  "quotations": [],
  "suppliers": []
}
```

Add script to `package.json`:

```json
{
  "scripts": {
    "mock-api": "json-server --watch apps/samba-web/mock-api/db.json --port 3000"
  }
}
```

Create environment files:

`apps/samba-web/src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',
};
```

`apps/samba-web/src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: '/api', // Will be replaced with actual backend URL
};
```

---

## Week 3-4: POS Feature Module

### Task 9: Create POS Feature Structure

Create the POS feature components:

```bash
# POS main page
apps/samba-web/src/app/features/pos/
├── pos.ts                    # Main POS component
├── pos.html
├── pos.scss
├── components/
│   ├── product-search/       # Barcode scanner + search
│   ├── cart/                 # Shopping cart
│   ├── payment/              # Payment processing
│   └── receipt/              # Receipt generation
└── pos.routes.ts
```

### Task 10: Implement Product Search with Barcode Scanner

Create `apps/samba-web/src/app/features/pos/components/product-search/product-search.ts`:

```typescript
import { Component, inject, output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { Product } from '../../../../_domain/product/models/product.model';
import { ProductStore } from '../../../../_domain/product/store/product.store';
import { ProductService } from '../../../../_domain/product/services/product.service';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="product-search">
      <input
        type="text"
        [formControl]="searchControl"
        placeholder="Scan barcode or search product..."
        (keydown.enter)="onEnter()"
        class="search-input"
        autofocus
      />

      @if (productStore.filteredProducts(); as products) {
        <div class="search-results">
          @for (product of products; track product.id) {
            <div
              class="product-item"
              (click)="selectProduct(product)"
            >
              <div class="product-info">
                <h4>{{ product.name }}</h4>
                <p>SKU: {{ product.sku }} | Stock: {{ product.stockLevel }}</p>
              </div>
              <div class="product-price">
                Rs. {{ product.price }}
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class ProductSearch {
  private productService = inject(ProductService);
  productStore = inject(ProductStore);

  searchControl = new FormControl('');
  productSelected = output<Product>();

  constructor() {
    // Handle barcode scanner input (USB scanner acts as keyboard)
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      if (value) {
        this.search(value);
      }
    });
  }

  search(query: string): void {
    this.productStore.setFilter({ search: query });
  }

  onEnter(): void {
    const value = this.searchControl.value;
    if (value && value.length >= 10) {
      // Likely a barcode scan
      this.searchByBarcode(value);
    }
  }

  searchByBarcode(barcode: string): void {
    this.productService.searchByBarcode(barcode).subscribe(product => {
      if (product) {
        this.selectProduct(product);
        this.searchControl.setValue('');
      }
    });
  }

  selectProduct(product: Product): void {
    this.productSelected.emit(product);
    this.searchControl.setValue('');
    this.productStore.clearFilter();
  }
}
```

### Task 11: Implement Shopping Cart

Create cart store at `apps/samba-web/src/app/features/pos/store/cart.store.ts`:

```typescript
import { computed } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Product } from '../../../_domain/product/models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

interface CartState {
  items: CartItem[];
  discount: number;
  tax: number;
}

const initialState: CartState = {
  items: [],
  discount: 0,
  tax: 0.17, // 17% GST
};

export const CartStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((store) => ({
    subtotal: computed(() => {
      return store.items().reduce((sum, item) => sum + item.subtotal, 0);
    }),

    taxAmount: computed(() => {
      return store.subtotal() * store.tax();
    }),

    discountAmount: computed(() => {
      return store.subtotal() * (store.discount() / 100);
    }),

    total: computed(() => {
      return store.subtotal() + store.taxAmount() - store.discountAmount();
    }),

    itemCount: computed(() => {
      return store.items().reduce((sum, item) => sum + item.quantity, 0);
    }),
  })),
  withMethods((store) => ({
    addItem(product: Product, quantity = 1): void {
      const existingItem = store.items().find(i => i.product.id === product.id);

      if (existingItem) {
        patchState(store, (state) => ({
          items: state.items.map(item =>
            item.product.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + quantity,
                  subtotal: (item.quantity + quantity) * item.product.price,
                }
              : item
          ),
        }));
      } else {
        const newItem: CartItem = {
          product,
          quantity,
          subtotal: product.price * quantity,
        };

        patchState(store, (state) => ({
          items: [...state.items, newItem],
        }));
      }
    },

    removeItem(productId: number): void {
      patchState(store, (state) => ({
        items: state.items.filter(i => i.product.id !== productId),
      }));
    },

    updateQuantity(productId: number, quantity: number): void {
      if (quantity <= 0) {
        this.removeItem(productId);
        return;
      }

      patchState(store, (state) => ({
        items: state.items.map(item =>
          item.product.id === productId
            ? {
                ...item,
                quantity,
                subtotal: quantity * item.product.price,
              }
            : item
        ),
      }));
    },

    setDiscount(discount: number): void {
      patchState(store, { discount });
    },

    clearCart(): void {
      patchState(store, { items: [], discount: 0 });
    },
  }))
);
```

### Task 12: Add Routes

Update `apps/samba-web/src/app/app.routes.ts`:

```typescript
import { Route } from '@angular/router';
import { authGuard } from './_infrastructure/guards/auth.guard';
import { roleGuard } from './_infrastructure/guards/role.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'pos',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes),
  },
  {
    path: 'pos',
    canActivate: [authGuard],
    loadChildren: () => import('./features/pos/pos.routes').then(m => m.posRoutes),
  },
  {
    path: 'inventory',
    canActivate: [authGuard, roleGuard(['admin', 'manager'])],
    loadChildren: () => import('./features/inventory/inventory.routes').then(m => m.inventoryRoutes),
  },
  {
    path: 'sales',
    canActivate: [authGuard],
    loadChildren: () => import('./features/sales/sales.routes').then(m => m.salesRoutes),
  },
  {
    path: 'reports',
    canActivate: [authGuard, roleGuard(['admin', 'manager'])],
    loadChildren: () => import('./features/reports/reports.routes').then(m => m.reportsRoutes),
  },
  {
    path: 'settings',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadChildren: () => import('./features/settings/settings.routes').then(m => m.settingsRoutes),
  },
  {
    path: '**',
    redirectTo: 'pos',
  },
];
```

---

## Week 5-6: Inventory & Sales Modules

Follow similar patterns:
- Create domain models and stores
- Build feature components using @ng-mf/components
- Implement business logic services
- Add routes with guards

---

## Week 7-8: Reports & Dashboard

Use components from `@ng-mf/components`:
- **Charts** - Sales charts and analytics
- **Datatable** - Report tables
- **Gauge** - Performance metrics
- **MicroChart** - Mini charts for dashboards

---

## Testing Strategy

### Unit Tests

```bash
# Test specific project
npx nx test samba-web

# Test with coverage
npx nx test samba-web --coverage
```

### E2E Tests

```bash
# Run e2e tests
npx nx e2e samba-web-e2e
```

---

## Build & Deployment

### Development Build

```bash
npx nx build samba-web
```

### Production Build

```bash
npx nx build samba-web --configuration=production
```

### Serve Application

```bash
# Start samba-web
npx nx serve samba-web

# Start with mock API
npm run mock-api
npx nx serve samba-web
```

---

## Next Steps

1. Complete Week 1 tasks (domain libraries, mock API)
2. Implement authentication feature (Week 2)
3. Build POS module with offline support (Week 3-4)
4. Add inventory management (Week 5)
5. Implement sales & quotations (Week 6)
6. Create reports dashboard (Week 7-8)
7. Final testing & refinements (Week 9-10)

---

## Additional Resources

- [DDD-ARCHITECTURE.md](./DDD-ARCHITECTURE.md) - Architecture deep dive
- [ANGULAR-20-BEST-PRACTICES.md](../../ANGULAR-20-BEST-PRACTICES.md) - Coding standards
- [COMPONENT-MAPPING.md](../../COMPONENT-MAPPING.md) - Component catalog
- [MODULE-FEDERATION-MIGRATION.md](./MODULE-FEDERATION-MIGRATION.md) - Future migration guide

---

## Support

For issues or questions:
- Review documentation files
- Check NX documentation: https://nx.dev
- Check Angular documentation: https://angular.dev
