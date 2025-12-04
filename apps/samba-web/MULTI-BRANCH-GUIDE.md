# Multi-Branch Architecture Guide

This guide explains how the Electric Store POS system supports multiple retail branches with independent inventory, sales tracking, and stock transfers.

## Overview

The multi-branch system allows:
- **Multiple retail locations** with independent operations
- **Branch-specific inventory** tracking
- **Stock transfers** between branches
- **Centralized reporting** across all branches
- **Branch-level user access control**
- **Offline operation** per branch

---

## Architecture

### Branch Hierarchy

```
Main Branch (HQ)
├── Branch 1 (North)
├── Branch 2 (South)
├── Branch 3 (East)
└── Branch 4 (West)
```

**Characteristics:**
- One **Main Branch** serves as headquarters
- Multiple **child branches** operate independently
- Each branch has its own **inventory**
- Users are assigned to **specific branches**
- **Admin** users can access all branches
- **Managers** and **Cashiers** can only access their assigned branch

---

## Data Model

### Branch Entity

```typescript
export interface Branch {
  id: number;
  name: string;
  code: string; // Unique branch code (e.g., "MAIN", "NORTH")
  address: string;
  city: string;
  phone: string;
  email: string;
  isMainBranch: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Branch-Aware Entities

All major entities include `branchId` for branch isolation:

```typescript
export interface Product {
  id: number;
  // ... other fields
  branchId: number; // 👈 Branch-specific
}

export interface Sale {
  id: number;
  // ... other fields
  branchId: number; // 👈 Recorded at specific branch
}

export interface InventoryAdjustment {
  id: number;
  // ... other fields
  branchId: number; // 👈 Adjustment at specific branch
}

export interface User {
  id: number;
  // ... other fields
  branchId: number; // 👈 User assigned to branch
}
```

---

## Branch Selection

### User Login Flow

1. **User logs in** with credentials
2. **System identifies** user's assigned branch
3. **Branch is auto-selected** based on user's `branchId`
4. **Admin users** can switch between branches

### Branch Store Implementation

`apps/samba-web/src/app/_domain/branch/store/branch.store.ts`:

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

    branchCount: computed(() => store.branches().length),

    hasBranches: computed(() => store.branches().length > 0),
  })),
  withMethods((store) => ({
    setBranches(branches: Branch[]): void {
      patchState(store, { branches, error: null });
    },

    selectBranch(branchId: number | null): void {
      patchState(store, { selectedBranchId: branchId });
      // Persist to localStorage for session
      if (branchId) {
        localStorage.setItem('selectedBranchId', branchId.toString());
      }
    },

    loadSelectedBranchFromStorage(): void {
      const savedBranchId = localStorage.getItem('selectedBranchId');
      if (savedBranchId) {
        patchState(store, { selectedBranchId: parseInt(savedBranchId, 10) });
      }
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

### Branch Selector Component

`apps/samba-web/src/app/_shared/components/branch-selector/branch-selector.ts`:

```typescript
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BranchStore } from '../../../_domain/branch/store/branch.store';
import { AuthStore } from '../../../_domain/user/store/auth.store';

@Component({
  selector: 'app-branch-selector',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="branch-selector">
      @if (authStore.isAdmin()) {
        <!-- Admin can select any branch -->
        <select
          [value]="branchStore.selectedBranchId()"
          (change)="onBranchChange($event)"
          class="select select-bordered"
        >
          <option value="" disabled>Select Branch</option>
          @for (branch of branchStore.activeBranches(); track branch.id) {
            <option [value]="branch.id">
              {{ branch.name }} {{ branch.isMainBranch ? '(Main)' : '' }}
            </option>
          }
        </select>
      } @else {
        <!-- Non-admin shows assigned branch -->
        <div class="branch-display">
          <span class="label">Branch:</span>
          <span class="branch-name">{{ branchStore.selectedBranch()?.name }}</span>
        </div>
      }
    </div>
  `,
})
export class BranchSelector {
  branchStore = inject(BranchStore);
  authStore = inject(AuthStore);

  onBranchChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const branchId = parseInt(select.value, 10);
    this.branchStore.selectBranch(branchId);

    // Reload data for new branch
    window.location.reload();
  }
}
```

---

## Branch-Filtered Data Loading

### Automatic Branch Filtering

All API requests automatically filter by selected branch:

```typescript
// Product service
@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiService = inject(ApiService);
  private branchStore = inject(BranchStore);

  getAll(): Observable<Product[]> {
    const branchId = this.branchStore.selectedBranchId();

    if (!branchId) {
      throw new Error('No branch selected');
    }

    return this.apiService.get<Product[]>(`/products?branchId=${branchId}`);
  }

  create(dto: CreateProductDto): Observable<Product> {
    const branchId = this.branchStore.selectedBranchId();

    return this.apiService.post<Product>('/products', {
      ...dto,
      branchId, // 👈 Automatically add branchId
    });
  }
}
```

### Branch Guard

Ensure branch is selected before accessing features:

`apps/samba-web/src/app/_infrastructure/guards/branch.guard.ts`:

```typescript
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BranchStore } from '../../_domain/branch/store/branch.store';

export const branchGuard: CanActivateFn = (route, state) => {
  const branchStore = inject(BranchStore);
  const router = inject(Router);

  if (branchStore.selectedBranchId()) {
    return true;
  }

  return router.createUrlTree(['/select-branch'], {
    queryParams: { returnUrl: state.url }
  });
};
```

Apply to routes:

```typescript
export const appRoutes: Route[] = [
  {
    path: 'pos',
    canActivate: [authGuard, branchGuard],
    loadChildren: () => import('./features/pos/pos.routes').then(m => m.posRoutes),
  },
  // ... other routes
];
```

---

## Stock Transfers Between Branches

### Stock Transfer Entity

```typescript
export interface StockTransfer {
  id: number;
  productId: number;
  fromBranchId: number;
  toBranchId: number;
  quantity: number;
  status: StockTransferStatus;
  requestedBy: number; // User ID
  approvedBy?: number; // User ID
  notes?: string;
  requestedAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
}

export type StockTransferStatus =
  | 'pending'
  | 'approved'
  | 'in-transit'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export interface CreateStockTransferDto {
  productId: number;
  fromBranchId: number;
  toBranchId: number;
  quantity: number;
  notes?: string;
}
```

### Stock Transfer Workflow

```
┌─────────────┐
│   Pending   │ ← Manager creates transfer request
└──────┬──────┘
       │
       ↓ Admin/Main Branch approves
┌─────────────┐
│  Approved   │
└──────┬──────┘
       │
       ↓ Stock deducted from source branch
┌─────────────┐
│ In Transit  │
└──────┬──────┘
       │
       ↓ Stock added to destination branch
┌─────────────┐
│  Completed  │
└─────────────┘
```

### Stock Transfer Service

`apps/samba-web/src/app/_domain/inventory/services/stock-transfer.service.ts`:

```typescript
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../../_infrastructure/services/api/api.service';
import { ProductStore } from '../../product/store/product.store';
import { CreateStockTransferDto, StockTransfer } from '../models/stock-transfer.model';

@Injectable({
  providedIn: 'root'
})
export class StockTransferService {
  private apiService = inject(ApiService);
  private productStore = inject(ProductStore);

  create(dto: CreateStockTransferDto): Observable<StockTransfer> {
    return this.apiService.post<StockTransfer>('/stock-transfers', dto);
  }

  approve(id: number): Observable<StockTransfer> {
    return this.apiService.post<StockTransfer>(`/stock-transfers/${id}/approve`, {});
  }

  markInTransit(id: number): Observable<StockTransfer> {
    return this.apiService.post<StockTransfer>(`/stock-transfers/${id}/in-transit`, {}).pipe(
      tap((transfer) => {
        // Deduct stock from source branch
        this.productStore.updateStock(transfer.productId, -transfer.quantity);
      })
    );
  }

  complete(id: number): Observable<StockTransfer> {
    return this.apiService.post<StockTransfer>(`/stock-transfers/${id}/complete`, {}).pipe(
      tap((transfer) => {
        // Add stock to destination branch
        this.productStore.updateStock(transfer.productId, transfer.quantity);
      })
    );
  }

  reject(id: number, reason: string): Observable<StockTransfer> {
    return this.apiService.post<StockTransfer>(`/stock-transfers/${id}/reject`, { reason });
  }

  cancel(id: number): Observable<StockTransfer> {
    return this.apiService.post<StockTransfer>(`/stock-transfers/${id}/cancel`, {});
  }

  getAll(): Observable<StockTransfer[]> {
    return this.apiService.get<StockTransfer[]>('/stock-transfers');
  }

  getById(id: number): Observable<StockTransfer> {
    return this.apiService.get<StockTransfer>(`/stock-transfers/${id}`);
  }

  getByBranch(branchId: number): Observable<StockTransfer[]> {
    return this.apiService.get<StockTransfer[]>(`/stock-transfers?branchId=${branchId}`);
  }

  getPending(): Observable<StockTransfer[]> {
    return this.apiService.get<StockTransfer[]>('/stock-transfers?status=pending');
  }
}
```

### Stock Transfer UI Component

`apps/samba-web/src/app/features/inventory/components/stock-transfer/stock-transfer.ts`:

```typescript
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BranchStore } from '../../../../_domain/branch/store/branch.store';
import { ProductStore } from '../../../../_domain/product/store/product.store';
import { StockTransferService } from '../../../../_domain/inventory/services/stock-transfer.service';
import { CreateStockTransferDto } from '../../../../_domain/inventory/models/stock-transfer.model';

@Component({
  selector: 'app-stock-transfer',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div class="stock-transfer">
      <h2>Request Stock Transfer</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <!-- Product Selection -->
        <div class="form-control">
          <label>Product</label>
          <select formControlName="productId" class="select select-bordered">
            <option value="" disabled>Select Product</option>
            @for (product of productStore.activeProducts(); track product.id) {
              <option [value]="product.id">
                {{ product.name }} (Stock: {{ product.stockLevel }})
              </option>
            }
          </select>
        </div>

        <!-- From Branch (current branch, disabled) -->
        <div class="form-control">
          <label>From Branch</label>
          <input
            type="text"
            [value]="branchStore.selectedBranch()?.name"
            class="input input-bordered"
            disabled
          />
        </div>

        <!-- To Branch -->
        <div class="form-control">
          <label>To Branch</label>
          <select formControlName="toBranchId" class="select select-bordered">
            <option value="" disabled>Select Destination Branch</option>
            @for (branch of otherBranches(); track branch.id) {
              <option [value]="branch.id">{{ branch.name }}</option>
            }
          </select>
        </div>

        <!-- Quantity -->
        <div class="form-control">
          <label>Quantity</label>
          <input
            type="number"
            formControlName="quantity"
            class="input input-bordered"
            min="1"
          />
        </div>

        <!-- Notes -->
        <div class="form-control">
          <label>Notes (Optional)</label>
          <textarea
            formControlName="notes"
            class="textarea textarea-bordered"
            rows="3"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="btn btn-primary"
          [disabled]="form.invalid || isSubmitting()"
        >
          {{ isSubmitting() ? 'Submitting...' : 'Request Transfer' }}
        </button>
      </form>
    </div>
  `,
})
export class StockTransfer {
  private fb = inject(FormBuilder);
  private stockTransferService = inject(StockTransferService);
  branchStore = inject(BranchStore);
  productStore = inject(ProductStore);

  isSubmitting = signal(false);

  form = this.fb.group({
    productId: ['', Validators.required],
    toBranchId: ['', Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    notes: [''],
  });

  otherBranches = computed(() => {
    const currentBranchId = this.branchStore.selectedBranchId();
    return this.branchStore.activeBranches().filter(b => b.id !== currentBranchId);
  });

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);

    const dto: CreateStockTransferDto = {
      productId: parseInt(this.form.value.productId!, 10),
      fromBranchId: this.branchStore.selectedBranchId()!,
      toBranchId: parseInt(this.form.value.toBranchId!, 10),
      quantity: this.form.value.quantity!,
      notes: this.form.value.notes || undefined,
    };

    this.stockTransferService.create(dto).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.form.reset();
        alert('Stock transfer request submitted successfully!');
      },
      error: () => {
        this.isSubmitting.set(false);
        alert('Failed to submit stock transfer request.');
      },
    });
  }
}
```

---

## Branch-Level Reporting

### Sales Report by Branch

```typescript
export interface BranchSalesReport {
  branchId: number;
  branchName: string;
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  averageOrderValue: number;
  topProducts: Array<{ productId: number; productName: string; quantity: number }>;
  period: { from: Date; to: Date };
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  private apiService = inject(ApiService);

  getSalesByBranch(from: Date, to: Date): Observable<BranchSalesReport[]> {
    return this.apiService.get<BranchSalesReport[]>(
      `/reports/sales-by-branch?from=${from.toISOString()}&to=${to.toISOString()}`
    );
  }

  getInventoryByBranch(branchId: number): Observable<InventoryReport> {
    return this.apiService.get<InventoryReport>(`/reports/inventory?branchId=${branchId}`);
  }
}
```

### Multi-Branch Dashboard

Show aggregated metrics across all branches (Admin only):

```typescript
@Component({
  selector: 'app-multi-branch-dashboard',
  template: `
    <div class="dashboard">
      <h1>Multi-Branch Dashboard</h1>

      <!-- Branch Comparison Cards -->
      <div class="grid grid-cols-4 gap-4">
        @for (branch of branches(); track branch.id) {
          <div class="card bg-base-100 shadow">
            <div class="card-body">
              <h2 class="card-title">{{ branch.name }}</h2>
              <p>Sales: Rs. {{ branchSales(branch.id)() | number }}</p>
              <p>Stock Value: Rs. {{ branchStockValue(branch.id)() | number }}</p>
            </div>
          </div>
        }
      </div>

      <!-- Stock Transfer Requests -->
      <div class="mt-8">
        <h2>Pending Stock Transfers</h2>
        <app-stock-transfer-list status="pending"></app-stock-transfer-list>
      </div>
    </div>
  `,
})
export class MultiBranchDashboard {
  // Implementation
}
```

---

## Access Control by Branch

### Role-Based Access with Branch Isolation

```typescript
export function branchAccessGuard(allowedRoles: UserRole[]): CanActivateFn {
  return (route, state) => {
    const authStore = inject(AuthStore);
    const branchStore = inject(BranchStore);
    const router = inject(Router);

    // Check authentication
    if (!authStore.isAuthenticated()) {
      return router.createUrlTree(['/auth/login']);
    }

    // Check role
    const userRole = authStore.userRole();
    if (!userRole || !allowedRoles.includes(userRole)) {
      return router.createUrlTree(['/unauthorized']);
    }

    // Check branch access
    const user = authStore.user();
    const selectedBranch = branchStore.selectedBranchId();

    if (user?.role !== 'admin' && user?.branchId !== selectedBranch) {
      // Non-admin trying to access different branch
      return router.createUrlTree(['/unauthorized']);
    }

    return true;
  };
}
```

---

## Mock Data for Multi-Branch Testing

Update `apps/samba-web/mock-api/db.json`:

```json
{
  "branches": [
    {
      "id": 1,
      "name": "Main Branch (HQ)",
      "code": "MAIN",
      "address": "123 Main Street",
      "city": "Karachi",
      "phone": "+92-21-1234567",
      "email": "main@electricstore.com",
      "isMainBranch": true,
      "isActive": true
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
      "isActive": true
    },
    {
      "id": 3,
      "name": "South Branch",
      "code": "SOUTH",
      "address": "789 South Road",
      "city": "Islamabad",
      "phone": "+92-51-1234567",
      "email": "south@electricstore.com",
      "isMainBranch": false,
      "isActive": true
    }
  ],
  "products": [
    {
      "id": 1,
      "name": "LED TV 55 inch",
      "sku": "TV-LED-55-001",
      "branchId": 1,
      "stockLevel": 15
    },
    {
      "id": 2,
      "name": "LED TV 55 inch",
      "sku": "TV-LED-55-002",
      "branchId": 2,
      "stockLevel": 8
    },
    {
      "id": 3,
      "name": "Washing Machine 7kg",
      "sku": "WM-AUTO-7KG-001",
      "branchId": 1,
      "stockLevel": 10
    }
  ],
  "stockTransfers": [
    {
      "id": 1,
      "productId": 1,
      "fromBranchId": 1,
      "toBranchId": 2,
      "quantity": 5,
      "status": "pending",
      "requestedBy": 2,
      "requestedAt": "2025-12-01T10:00:00.000Z"
    }
  ]
}
```

---

## Best Practices

### 1. Always Filter by Branch

```typescript
// ✅ Good: Branch-aware query
getProducts(branchId: number): Observable<Product[]> {
  return this.apiService.get<Product[]>(`/products?branchId=${branchId}`);
}

// ❌ Bad: No branch filter
getAllProducts(): Observable<Product[]> {
  return this.apiService.get<Product[]>('/products');
}
```

### 2. Validate Branch Access

```typescript
// ✅ Good: Check user's branch before operation
createSale(sale: CreateSaleDto): Observable<Sale> {
  const userBranchId = this.authStore.user()?.branchId;
  const selectedBranchId = this.branchStore.selectedBranchId();

  if (userBranchId !== selectedBranchId && !this.authStore.isAdmin()) {
    throw new Error('Cannot create sale for different branch');
  }

  return this.apiService.post<Sale>('/sales', sale);
}
```

### 3. Isolate Branch Data in IndexedDB

```typescript
// ✅ Good: Include branch ID in IndexedDB key
async saveProduct(product: Product): Promise<void> {
  await this.storage.save('products', {
    ...product,
    _key: `${product.branchId}_${product.id}`, // Composite key
  });
}
```

---

## Conclusion

This multi-branch architecture enables:
- ✅ Independent branch operations
- ✅ Centralized inventory management
- ✅ Efficient stock transfers
- ✅ Branch-level reporting
- ✅ Role-based access control
- ✅ Scalable growth to multiple locations

---

## Additional Resources

- [DDD-ARCHITECTURE.md](./DDD-ARCHITECTURE.md)
- [IMPLEMENTATION-GUIDE.md](./IMPLEMENTATION-GUIDE.md)
- [OFFLINE-SYNC-STRATEGY.md](./OFFLINE-SYNC-STRATEGY.md)
