# Angular 20 Best Practices & Coding Standards

This document outlines the coding standards, best practices, and conventions for Angular 20 development in this NX monorepo workspace.

---

## Table of Contents

1. [File Naming Conventions](#file-naming-conventions)
2. [Component Architecture](#component-architecture)
3. [Dependency Injection](#dependency-injection)
4. [State Management](#state-management)
5. [Signals & Reactivity](#signals--reactivity)
6. [TypeScript Best Practices](#typescript-best-practices)
7. [Routing](#routing)
8. [Forms](#forms)
9. [HTTP & API Integration](#http--api-integration)
10. [Testing](#testing)
11. [Performance](#performance)
12. [Accessibility](#accessibility)

---

## 1. File Naming Conventions

### Angular 20 Simplified Naming (No Suffixes)

**✅ DO:**
```
product-list.ts          # Component file
product-list.html        # Template file
product-list.scss        # Styles file
product-list.spec.ts     # Test file
product.service.ts       # Service file (keep suffix)
product.routes.ts        # Routes file (keep suffix)
product.store.ts         # Store file (keep suffix)
product.model.ts         # Model file (keep suffix)
```

**❌ DON'T:**
```
product-list.component.ts       # Old convention
product-list.component.html     # Old convention
product-list.component.scss     # Old convention
```

### File Organization

```
feature/
├── components/
│   ├── product-list/
│   │   ├── product-list.ts          # Main component
│   │   ├── product-list.html
│   │   ├── product-list.scss
│   │   └── product-list.spec.ts
│   └── product-form/
│       ├── product-form.ts
│       ├── product-form.html
│       ├── product-form.scss
│       └── product-form.spec.ts
├── services/
│   └── product.service.ts
├── models/
│   └── product.model.ts
├── store/
│   └── product.store.ts
└── feature.routes.ts
```

---

## 2. Component Architecture

### Standalone Components (Required)

**✅ DO - Use standalone components everywhere:**

```typescript
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { DataView } from '@ng-mf/components';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButton,
    DataView,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  host: {
    class: 'block w-full',
  },
})
export class ProductList {
  // Component logic
}
```

### Component Structure

**✅ DO - Follow this order:**

```typescript
@Component({
  // 1. Metadata
  selector: 'app-example',
  standalone: true,
  imports: [...],
  providers: [...],
  templateUrl: './example.html',
  styleUrl: './example.scss',
  host: { class: 'block' },
})
export class Example {
  // 2. Injected dependencies
  private productService = inject(ProductService);
  private router = inject(Router);

  // 3. Input properties
  @Input() productId?: number;

  // 4. Output properties
  @Output() productSelected = output<Product>();

  // 5. Signals
  products = signal<Product[]>([]);
  isLoading = signal(false);

  // 6. Computed signals
  filteredProducts = computed(() => {
    return this.products().filter(p => p.active);
  });

  // 7. Lifecycle hooks
  ngOnInit() {
    this.loadProducts();
  }

  ngOnDestroy() {
    // Cleanup
  }

  // 8. Public methods
  loadProducts() {
    // Implementation
  }

  // 9. Private methods
  private filterProducts() {
    // Implementation
  }
}
```

### Host Bindings

**✅ DO - Use host property for styling:**

```typescript
@Component({
  selector: 'app-card',
  host: {
    class: 'block rounded-lg shadow-md p-4',
    '[class.active]': 'isActive()',
    '(click)': 'handleClick()',
  },
})
```

---

## 3. Dependency Injection

### Use inject() Function (Preferred)

**✅ DO - Use inject() in class fields:**

```typescript
export class ProductList {
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private confirmManager = inject(ConfirmManager);

  // Optional injection
  private analytics = inject(AnalyticsService, { optional: true });
}
```

**❌ DON'T - Use constructor injection (old style):**

```typescript
export class ProductList {
  constructor(
    private productService: ProductService,
    private router: Router
  ) {}
}
```

### Service Definition

**✅ DO - Use providedIn: 'root' for singleton services:**

```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }
}
```

---

## 4. State Management

### NgRx Signal Store (Preferred)

**✅ DO - Use SignalStore for reactive state:**

```typescript
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { computed } from '@angular/core';

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    categoryId: number | null;
    searchQuery: string;
  };
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  filters: {
    categoryId: null,
    searchQuery: '',
  },
};

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => ({
    filteredProducts: computed(() => {
      const products = store.products();
      const filters = store.filters();

      if (filters.categoryId) {
        return products.filter(p => p.categoryId === filters.categoryId);
      }

      return products;
    }),

    productCount: computed(() => store.products().length),
  })),

  withMethods((store) => ({
    setProducts(products: Product[]): void {
      patchState(store, { products, error: null });
    },

    addProduct(product: Product): void {
      patchState(store, {
        products: [product, ...store.products()],
      });
    },

    updateProduct(id: number, updates: Partial<Product>): void {
      patchState(store, {
        products: store.products().map(p =>
          p.id === id ? { ...p, ...updates } : p
        ),
      });
    },

    setLoading(isLoading: boolean): void {
      patchState(store, { isLoading });
    },

    setError(error: string): void {
      patchState(store, { error, isLoading: false });
    },
  }))
);
```

### Using Stores in Components

**✅ DO:**

```typescript
export class ProductList {
  productStore = inject(ProductStore);

  ngOnInit() {
    // Access state
    console.log(this.productStore.products());

    // Call methods
    this.productStore.setLoading(true);

    // Use computed values
    console.log(this.productStore.filteredProducts());
  }
}
```

**Template:**

```html
<div *ngIf="productStore.isLoading()">Loading...</div>
<div *ngFor="let product of productStore.filteredProducts()">
  {{ product.name }}
</div>
```

---

## 5. Signals & Reactivity

### Signals

**✅ DO - Use signals for reactive state:**

```typescript
export class ProductList {
  // Writable signals
  searchQuery = signal('');
  selectedCategory = signal<number | null>(null);

  // Computed signals (derived state)
  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const categoryId = this.selectedCategory();

    return this.products()
      .filter(p => categoryId ? p.categoryId === categoryId : true)
      .filter(p => p.name.toLowerCase().includes(query));
  });

  // Update signals
  updateSearch(query: string) {
    this.searchQuery.set(query);
  }
}
```

### Effects

**✅ DO - Use effects for side effects:**

```typescript
import { effect } from '@angular/core';

export class ProductList {
  searchQuery = signal('');

  constructor() {
    // Log whenever search query changes
    effect(() => {
      console.log('Search query:', this.searchQuery());
    });
  }
}
```

### Input/Output Signals

**✅ DO - Use input() and output() for Angular 20:**

```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: true,
  template: `
    <button (click)="handleClick()">{{ product().name }}</button>
  `,
})
export class ProductCard {
  // Input signal
  product = input.required<Product>();

  // Output signal
  productSelected = output<Product>();

  handleClick() {
    this.productSelected.emit(this.product());
  }
}
```

---

## 6. TypeScript Best Practices

### Type Safety

**✅ DO - Define explicit types:**

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  stockLevel: number;
  status: 'active' | 'inactive';
}

interface ProductFilters {
  categoryId: number | null;
  searchQuery: string;
  status: 'all' | 'active' | 'inactive';
}
```

### Utility Types

**✅ DO - Use TypeScript utility types:**

```typescript
// Partial - make all properties optional
type PartialProduct = Partial<Product>;

// Pick - select specific properties
type ProductSummary = Pick<Product, 'id' | 'name' | 'price'>;

// Omit - exclude properties
type ProductWithoutId = Omit<Product, 'id'>;

// Required - make all properties required
type RequiredProduct = Required<Partial<Product>>;
```

### Enums vs Union Types

**✅ DO - Prefer string literal unions:**

```typescript
type ProductStatus = 'active' | 'inactive' | 'discontinued';
type PaymentMethod = 'cash' | 'card' | 'mobile';
```

**❌ DON'T - Use enums unless necessary:**

```typescript
enum ProductStatus {
  Active = 'active',
  Inactive = 'inactive'
}
```

---

## 7. Routing

### Route Configuration

**✅ DO - Use functional route configuration:**

```typescript
import { Route } from '@angular/router';

export const productRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./product-list').then(m => m.ProductList),
  },
  {
    path: 'create',
    loadComponent: () => import('./product-form').then(m => m.ProductForm),
    canActivate: [authGuard, roleGuard],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./product-form').then(m => m.ProductForm),
    canActivate: [authGuard],
  },
];
```

### Functional Guards

**✅ DO - Use functional guards:**

```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore } from '../domain/user/store/auth.store';

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

  if (!requiredRoles) {
    return true;
  }

  return authStore.hasAnyRole(requiredRoles);
};
```

---

## 8. Forms

### Reactive Forms

**✅ DO - Use typed reactive forms:**

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class ProductForm {
  private fb = inject(FormBuilder);

  productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(0)]],
    categoryId: [null as number | null, Validators.required],
    stockLevel: [0, Validators.min(0)],
  });

  submitForm() {
    if (this.productForm.valid) {
      const product = this.productForm.getRawValue();
      // Submit product
    }
  }
}
```

### Form Validation

**✅ DO - Create custom validators:**

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function priceRangeValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (value == null || value === '') {
      return null;
    }

    if (value < min || value > max) {
      return {
        priceRange: {
          min,
          max,
          actual: value
        }
      };
    }

    return null;
  };
}
```

---

## 9. HTTP & API Integration

### HTTP Interceptors

**✅ DO - Use functional interceptors:**

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../domain/user/store/auth.store';

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

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Handle unauthorized
      }
      return throwError(() => error);
    })
  );
};
```

### API Services

**✅ DO - Create typed API services:**

```typescript
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
}
```

---

## 10. Testing

### Component Testing (Vitest)

**✅ DO - Write comprehensive tests:**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductList } from './product-list';
import { ProductStore } from '../store/product.store';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let productStore: ProductStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [ProductStore],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    productStore = TestBed.inject(ProductStore);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    const mockProducts: Product[] = [
      { id: 1, name: 'Product 1', price: 100 },
    ];

    productStore.setProducts(mockProducts);
    component.ngOnInit();

    expect(productStore.products()).toEqual(mockProducts);
  });
});
```

---

## 11. Performance

### Change Detection

**✅ DO - Use OnPush change detection:**

```typescript
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`,
})
export class ProductCard {
  @Input() product?: Product;
}
```

### Lazy Loading

**✅ DO - Lazy load routes:**

```typescript
const routes: Route[] = [
  {
    path: 'inventory',
    loadChildren: () => import('./inventory/inventory.routes').then(m => m.inventoryRoutes),
  },
];
```

### TrackBy Functions

**✅ DO - Use trackBy for ngFor:**

```typescript
export class ProductList {
  products = signal<Product[]>([]);

  trackByProductId(index: number, product: Product): number {
    return product.id;
  }
}
```

```html
<div *ngFor="let product of products(); trackBy: trackByProductId">
  {{ product.name }}
</div>
```

---

## 12. Accessibility

### Semantic HTML

**✅ DO - Use semantic HTML elements:**

```html
<nav aria-label="Main navigation">
  <ul>
    <li><a routerLink="/pos">POS</a></li>
    <li><a routerLink="/inventory">Inventory</a></li>
  </ul>
</nav>

<main>
  <section aria-labelledby="products-heading">
    <h2 id="products-heading">Products</h2>
    <!-- Content -->
  </section>
</main>
```

### ARIA Attributes

**✅ DO - Add ARIA attributes:**

```html
<button
  (click)="deleteProduct()"
  aria-label="Delete product"
  [attr.aria-busy]="isLoading()"
>
  <mat-icon>delete</mat-icon>
</button>

<div
  role="alert"
  [attr.aria-live]="'polite'"
  *ngIf="errorMessage()"
>
  {{ errorMessage() }}
</div>
```

---

## Summary

### Key Takeaways

1. **No `.component` suffix** - Use Angular 20 simplified naming
2. **Standalone components** - Always use standalone: true
3. **Use inject()** - Prefer inject() over constructor injection
4. **NgRx Signal Store** - For reactive state management
5. **Signals** - Use signals for reactive data
6. **TypeScript** - Full type safety everywhere
7. **Functional guards** - Use functional route guards
8. **Functional interceptors** - Use functional HTTP interceptors
9. **OnPush** - Use OnPush change detection
10. **Accessibility** - Always consider a11y

---

**Last Updated:** 2025-12-02
**Angular Version:** 20.3+
**NX Version:** 22.0.2
