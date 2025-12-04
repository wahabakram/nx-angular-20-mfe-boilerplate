# Domain-Driven Design (DDD) Architecture Guide

## Electric Store POS & Inventory Management System

This document explains the Domain-Driven Design architecture used in the samba-web application.

---

## Table of Contents

1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [Domain Layer](#domain-layer)
4. [Infrastructure Layer](#infrastructure-layer)
5. [Shared Layer](#shared-layer)
6. [Features Layer](#features-layer)
7. [Implementation Guidelines](#implementation-guidelines)
8. [Examples](#examples)

---

## Overview

### What is Domain-Driven Design?

Domain-Driven Design (DDD) is a software development approach that focuses on:
- **Domain Logic**: Business rules and logic at the core
- **Separation of Concerns**: Clear boundaries between layers
- **Ubiquitous Language**: Consistent terminology across the team
- **Strategic Design**: Organizing code around business domains

### Why DDD for Electric Store?

Our POS & Inventory system benefits from DDD because:
1. **Complex Business Logic**: Product management, multi-branch inventory, offline sync
2. **Clear Separation**: Domain models independent of UI and infrastructure
3. **Testability**: Business logic can be tested in isolation
4. **Scalability**: Easy to add new features (branches, currencies, etc.)
5. **Team Collaboration**: Clear structure for multiple developers

---

## Folder Structure

```
apps/samba-web/src/app/
├── _domain/              # ⭐ BUSINESS LOGIC & DOMAIN MODELS
│   ├── product/
│   │   ├── models/       # Product, Category interfaces
│   │   ├── store/        # ProductStore (NgRx Signals)
│   │   └── services/     # Product business logic services
│   ├── inventory/
│   │   ├── models/
│   │   ├── store/
│   │   └── services/
│   ├── sale/
│   │   ├── models/       # Sale, CartItem, Transaction
│   │   ├── store/        # CartStore, SaleStore
│   │   └── services/
│   ├── customer/
│   │   ├── models/
│   │   ├── store/
│   │   └── services/
│   ├── branch/           # 🔥 CRITICAL - Multi-branch support
│   │   ├── models/
│   │   ├── store/
│   │   └── services/
│   ├── user/             # 🔥 CRITICAL - Auth & roles
│   │   ├── models/       # User, Role, Permission
│   │   ├── store/        # AuthStore
│   │   └── services/
│   ├── quotation/
│   │   ├── models/
│   │   ├── store/
│   │   └── services/
│   ├── supplier/
│   │   ├── models/
│   │   ├── store/
│   │   └── services/
│   └── category/
│       ├── models/
│       ├── store/
│       └── services/
│
├── _infrastructure/      # ⚙️ TECHNICAL CONCERNS
│   ├── guards/           # Route guards (auth, role)
│   ├── interceptors/     # HTTP interceptors
│   ├── services/
│   │   ├── api/          # API service layer
│   │   ├── mock/         # Mock data services (MVP)
│   │   ├── offline/      # 🔥 Offline sync service
│   │   └── storage/      # IndexedDB wrapper
│   └── utils/            # Utility functions
│
├── _shared/              # 🎨 SHARED UI COMPONENTS
│   ├── layouts/          # Main layout, headers, footers
│   ├── components/       # Reusable UI components
│   ├── directives/       # Custom directives
│   └── pipes/            # Custom pipes
│
└── features/             # 📦 FEATURE MODULES
    ├── auth/             # Login, logout, register
    ├── pos/              # POS interface
    ├── inventory/        # Inventory management
    ├── sales/            # Sales & quotations
    ├── reports/          # Dashboard & reports
    └── settings/         # Settings, users, branches
```

---

## Domain Layer

### Purpose
Contains **pure business logic** independent of frameworks, UI, and infrastructure.

### Structure

#### Models (`models/`)
TypeScript interfaces and types representing domain entities.

**Example: Product Model**
```typescript
// apps/samba-web/src/app/_domain/product/models/product.model.ts

export interface Product {
  id: number;
  name: string;
  description: string;
  sku: string;
  barcode?: string;
  price: number;
  costPrice: number;
  categoryId: number;
  supplierId?: number;
  status: ProductStatus;
  stockLevel: number;
  lowStockThreshold: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductStatus = 'active' | 'inactive' | 'discontinued';

export interface Category {
  id: number;
  name: string;
  parentId?: number;
  description?: string;
}

export interface BranchStock {
  productId: number;
  branchId: number;
  stockLevel: number;
  lastUpdated: Date;
}
```

**Example: Sale Model**
```typescript
// apps/samba-web/src/app/_domain/sale/models/sale.model.ts

export interface Sale {
  id: number;
  invoiceNumber: string;
  customerId?: number;
  branchId: number;
  cashierId: number;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: SaleStatus;
  createdAt: Date;
  syncedAt?: Date; // For offline sync
}

export interface SaleItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export type PaymentMethod = 'cash' | 'card' | 'mobile' | 'mixed';
export type SaleStatus = 'completed' | 'pending' | 'cancelled' | 'refunded';

export interface CartItem {
  productId: number;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  subtotal: number;
}
```

#### Stores (`store/`)
NgRx Signal Stores for reactive state management.

**Example: Product Store**
```typescript
// apps/samba-web/src/app/_domain/product/store/product.store.ts

import { computed } from '@angular/core';
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { Product, ProductFilters } from '../models/product.model';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  filters: ProductFilters;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  filters: {
    categoryId: null,
    branchId: null,
    searchQuery: '',
    status: 'all',
  },
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    // Filtered products based on current filters
    filteredProducts: computed(() => {
      const products = store.products();
      const filters = store.filters();

      return products
        .filter(p => filters.categoryId ? p.categoryId === filters.categoryId : true)
        .filter(p => filters.branchId ? p.branchId === filters.branchId : true)
        .filter(p => filters.searchQuery ?
          p.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          p.sku?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
          p.barcode?.includes(filters.searchQuery)
          : true
        )
        .filter(p => filters.status !== 'all' ? p.status === filters.status : true);
    }),

    // Low stock products for alerts
    lowStockProducts: computed(() => {
      return store.products().filter(p => p.stockLevel <= p.lowStockThreshold);
    }),

    // Statistics for dashboard
    statistics: computed(() => ({
      total: store.products().length,
      active: store.products().filter(p => p.status === 'active').length,
      inactive: store.products().filter(p => p.status === 'inactive').length,
      lowStock: store.products().filter(p => p.stockLevel <= p.lowStockThreshold).length,
      outOfStock: store.products().filter(p => p.stockLevel === 0).length,
      totalValue: store.products().reduce((sum, p) => sum + (p.stockLevel * p.price), 0),
    })),
  })),

  withMethods((store) => ({
    // Set products list
    setProducts(products: Product[]): void {
      patchState(store, { products, error: null });
    },

    // Add new product
    addProduct(product: Product): void {
      patchState(store, {
        products: [product, ...store.products()],
      });
    },

    // Update existing product
    updateProduct(id: number, updates: Partial<Product>): void {
      patchState(store, {
        products: store.products().map(p =>
          p.id === id ? { ...p, ...updates } : p
        ),
      });
    },

    // Delete product
    deleteProduct(id: number): void {
      patchState(store, {
        products: store.products().filter(p => p.id !== id),
      });
    },

    // Update stock level
    updateStock(productId: number, quantity: number): void {
      patchState(store, {
        products: store.products().map(p =>
          p.id === productId
            ? { ...p, stockLevel: p.stockLevel + quantity }
            : p
        ),
      });
    },

    // Set filters
    setFilters(filters: Partial<ProductFilters>): void {
      patchState(store, {
        filters: { ...store.filters(), ...filters },
      });
    },

    // Set loading state
    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },

    // Set error
    setError(error: string | null): void {
      patchState(store, { error, isLoading: false });
    },

    // Clear all state
    reset(): void {
      patchState(store, initialState);
    },
  }))
);
```

#### Services (`services/`)
Business logic services (optional, use when logic doesn't fit in stores).

**Example: Stock Transfer Service**
```typescript
// apps/samba-web/src/app/_domain/inventory/services/stock-transfer.service.ts

import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductStore } from '../../product/store/product.store';
import { BranchStore } from '../../branch/store/branch.store';

export interface StockTransfer {
  productId: number;
  fromBranchId: number;
  toBranchId: number;
  quantity: number;
  reason: string;
  requestedBy: number;
  approvedBy?: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
}

@Injectable({ providedIn: 'root' })
export class StockTransferService {
  private productStore = inject(ProductStore);
  private branchStore = inject(BranchStore);

  /**
   * Validate stock transfer request
   */
  validateTransfer(transfer: StockTransfer): { valid: boolean; error?: string } {
    const product = this.productStore.products().find(p => p.id === transfer.productId);

    if (!product) {
      return { valid: false, error: 'Product not found' };
    }

    if (transfer.fromBranchId === transfer.toBranchId) {
      return { valid: false, error: 'Cannot transfer to the same branch' };
    }

    if (transfer.quantity <= 0) {
      return { valid: false, error: 'Quantity must be greater than 0' };
    }

    // Check stock availability in source branch
    const sourceStock = product.stockLevel; // In real app, this would be branch-specific
    if (sourceStock < transfer.quantity) {
      return { valid: false, error: `Insufficient stock. Available: ${sourceStock}` };
    }

    return { valid: true };
  }

  /**
   * Create stock transfer request
   */
  createTransferRequest(transfer: StockTransfer): Observable<StockTransfer> {
    const validation = this.validateTransfer(transfer);

    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // In real app, this would call API
    return of({ ...transfer, status: 'pending' as const });
  }
}
```

---

## Infrastructure Layer

### Purpose
Handles **technical concerns** like HTTP, authentication, offline storage, etc.

### Structure

#### Guards (`guards/`)
Route protection logic.

**Example: Auth Guard**
```typescript
// apps/samba-web/src/app/_infrastructure/guards/auth.guard.ts

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../../_domain/user/store/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

export const roleGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const requiredRoles = route.data?.['roles'] as string[];

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  return authStore.hasAnyRole(requiredRoles);
};
```

#### Interceptors (`interceptors/`)
HTTP request/response interceptors.

**Example: Auth Interceptor**
```typescript
// apps/samba-web/src/app/_infrastructure/interceptors/auth.interceptor.ts

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

**Example: Offline Interceptor**
```typescript
// apps/samba-web/src/app/_infrastructure/interceptors/offline.interceptor.ts

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { OfflineService } from '../services/offline/offline.service';

export const offlineInterceptor: HttpInterceptorFn = (req, next) => {
  const offlineService = inject(OfflineService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!navigator.onLine || error.status === 0) {
        // Queue request for later retry
        offlineService.queueRequest(req);
        return throwError(() => new Error('Offline - request queued'));
      }
      return throwError(() => error);
    })
  );
};
```

#### Services (`services/`)

**API Service Layer (`services/api/`)**
```typescript
// apps/samba-web/src/app/_infrastructure/services/api/product-api.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../../../_domain/product/models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductApiService {
  private http = inject(HttpClient);
  private baseUrl = '/api/products';

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  create(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }

  update(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getByBarcode(barcode: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/barcode/${barcode}`);
  }
}
```

**Mock Service (`services/mock/`)** - For MVP development
```typescript
// apps/samba-web/src/app/_infrastructure/services/mock/mock-product.service.ts

import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product } from '../../../_domain/product/models/product.model';

@Injectable({ providedIn: 'root' })
export class MockProductService {
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'LED Bulb 9W',
      description: 'Energy efficient LED bulb',
      sku: 'LED-9W-001',
      barcode: '1234567890123',
      price: 150,
      costPrice: 100,
      categoryId: 1,
      status: 'active',
      stockLevel: 50,
      lowStockThreshold: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // ... more mock data
  ];

  getAll(): Observable<Product[]> {
    return of(this.mockProducts).pipe(delay(300));
  }

  getById(id: number): Observable<Product> {
    const product = this.mockProducts.find(p => p.id === id);
    return of(product!).pipe(delay(200));
  }
}
```

**Storage Service (`services/storage/`)** - IndexedDB wrapper
```typescript
// apps/samba-web/src/app/_infrastructure/services/storage/indexed-db.service.ts

import { Injectable } from '@angular/core';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ElectricStoreDB extends DBSchema {
  products: {
    key: number;
    value: any;
  };
  cart: {
    key: string;
    value: any;
  };
  syncQueue: {
    key: number;
    value: any;
  };
}

@Injectable({ providedIn: 'root' })
export class IndexedDBService {
  private db: IDBPDatabase<ElectricStoreDB> | null = null;

  async init(): Promise<void> {
    this.db = await openDB<ElectricStoreDB>('electric-store', 1, {
      upgrade(db) {
        db.createObjectStore('products', { keyPath: 'id' });
        db.createObjectStore('cart', { keyPath: 'id' });
        db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
      },
    });
  }

  async saveToCache(storeName: keyof ElectricStoreDB, data: any): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.put(storeName, data);
  }

  async getFromCache(storeName: keyof ElectricStoreDB, key: any): Promise<any> {
    if (!this.db) await this.init();
    return await this.db!.get(storeName, key);
  }

  async getAllFromCache(storeName: keyof ElectricStoreDB): Promise<any[]> {
    if (!this.db) await this.init();
    return await this.db!.getAll(storeName);
  }
}
```

---

## Shared Layer

### Purpose
**Reusable UI components**, layouts, directives, and pipes shared across features.

### Structure

**Layouts (`_shared/layouts/`)**
```typescript
// apps/samba-web/src/app/_shared/layouts/main-layout/main-layout.ts

import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Layout, LayoutSidebar, LayoutHeader, LayoutBody } from '@ng-mf/components';
import { BranchStore } from '../../../_domain/branch/store/branch.store';
import { AuthStore } from '../../../_domain/user/store/auth.store';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterModule, Layout, LayoutSidebar, LayoutHeader, LayoutBody],
  template: `
    <emr-layout>
      <emr-layout-header>
        <!-- Header with branch selector, user menu -->
        <div class="flex items-center justify-between">
          <h1>Electric Store POS</h1>
          <div class="flex items-center gap-4">
            <branch-selector />
            <user-menu />
          </div>
        </div>
      </emr-layout-header>

      <emr-layout-sidebar>
        <app-navigation />
      </emr-layout-sidebar>

      <emr-layout-body>
        <router-outlet></router-outlet>
      </emr-layout-body>
    </emr-layout>
  `,
})
export class MainLayout {
  branchStore = inject(BranchStore);
  authStore = inject(AuthStore);
}
```

**Components (`_shared/components/`)**
Small reusable UI components specific to your app.

---

## Features Layer

### Purpose
**Feature modules** organized by business capability.

### Structure

Each feature contains:
- Routes
- Components
- Feature-specific logic

**Example: POS Feature**
```
features/pos/
├── pos.routes.ts              # POS routes
├── pos-main/                  # Main POS screen
│   ├── pos-main.ts
│   ├── pos-main.html
│   └── pos-main.scss
├── product-search/            # Product search component
├── cart/                      # Cart component
└── payment/                   # Payment component
```

---

## Implementation Guidelines

### 1. Domain Models
- ✅ **DO:** Keep models as TypeScript interfaces
- ✅ **DO:** Use type unions for status fields
- ❌ **DON'T:** Add framework-specific code in models

### 2. Stores
- ✅ **DO:** Use NgRx Signal Stores for state
- ✅ **DO:** Add computed properties for derived state
- ✅ **DO:** Keep stores focused on single domain
- ❌ **DON'T:** Mix UI state with domain state

### 3. Services
- ✅ **DO:** Keep business logic in domain services
- ✅ **DO:** Keep technical logic in infrastructure services
- ✅ **DO:** Use dependency injection
- ❌ **DON'T:** Put UI logic in services

### 4. Feature Modules
- ✅ **DO:** Keep features focused and cohesive
- ✅ **DO:** Use domain stores and services
- ✅ **DO:** Import from `@ng-mf/components` for UI
- ❌ **DON'T:** Duplicate domain logic in features

---

## Summary

### Layer Responsibilities

| Layer | Purpose | Examples |
|-------|---------|----------|
| **Domain** | Business logic, state | ProductStore, Sale model, Stock transfer logic |
| **Infrastructure** | Technical concerns | HTTP, Auth, Offline sync, IndexedDB |
| **Shared** | Reusable UI | Layouts, common components, pipes |
| **Features** | Business features | POS screen, Inventory page, Reports |

### Benefits

1. **Testability**: Test domain logic without UI
2. **Maintainability**: Clear separation of concerns
3. **Scalability**: Easy to add features
4. **Team Collaboration**: Clear structure for multiple developers
5. **Reusability**: Domain logic reusable across features

---

**Last Updated:** 2025-12-02
**Application:** samba-web (Electric Store POS)
**Architecture:** Domain-Driven Design (DDD)
