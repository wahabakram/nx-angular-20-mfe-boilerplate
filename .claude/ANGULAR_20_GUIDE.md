# Angular 20 - Complete Guide

**Last Updated:** December 7, 2025  
**Angular Version:** 20  
**Philosophy:** Intent-First, Domain-Driven Development

---

## 📖 Table of Contents

### Part 1: Naming Conventions
1. [Philosophy: Intent-First Naming](#philosophy-intent-first-naming)
2. [Components](#components-intent-first-naming)
3. [Services](#services-domain-driven-naming)
4. [Directives](#directives-keep-the-suffix)
5. [Pipes](#pipes-keep-the-suffix)
6. [Quick Reference Table](#quick-reference-table)

### Part 2: Best Practices
7. [Component Architecture](#component-architecture)
8. [Dependency Injection](#dependency-injection)
9. [State Management with Signals](#state-management-with-signals)
10. [Reactive Programming](#reactive-programming)
11. [Forms](#forms)
12. [HTTP & API Integration](#http--api-integration)
13. [Routing](#routing)
14. [Testing](#testing)
15. [Performance](#performance)
16. [Accessibility](#accessibility)

---

# Part 1: Naming Conventions

## Philosophy: Intent-First Naming

Angular 20 introduces **intent-first naming** - focus on **what the code does**, not just what type it is.

**Key Principles:**
- Name describes purpose and behavior
- Components and Services drop type suffixes
- Directives and Pipes keep suffixes for clarity
- Services use domain-driven names

---

## Components: Intent-First Naming

### ✅ Angular 20 Convention

**File Naming:**
```
user-profile.ts                    ✅ NO .component suffix
hero-list.ts                       ✅ kebab-case, intent-first
dashboard.ts                       ✅ Simplified
```

**Class Naming:**
```typescript
// ✅ ANGULAR 20 - NO Component suffix
export class UserProfile { }       
export class HeroList { }          
export class Dashboard { }         

// ❌ OLD - Don't use anymore
export class UserProfileComponent { }  
export class HeroListComponent { }     
```

**Selector Naming:**
```typescript
@Component({
  selector: 'app-user-profile',    // ✅ kebab-case with prefix
  imports: [],
  template: `<div>{{ user().name }}</div>`
})
export class UserProfile {         // ✅ Matches intent
  user = input.required<User>();
}
```

### Complete Example

```typescript
// File: product-list.ts
import { Component, inject, signal, input, computed } from '@angular/core';
import { ProductApi } from './product-api';

@Component({
  selector: 'app-product-list',
  imports: [],
  template: `
    @if (loading()) {
      <div>Loading...</div>
    } @else {
      @for (product of products(); track product.id) {
        <div class="product">{{ product.name }}</div>
      } @empty {
        <div>No products found</div>
      }
    }
  `
})
export class ProductList {  // ✅ NO Component suffix
  private productApi = inject(ProductApi);
  
  categoryId = input<string>();
  products = signal<Product[]>([]);
  loading = signal(false);
  
  filteredProducts = computed(() => {
    const catId = this.categoryId();
    return catId 
      ? this.products().filter(p => p.categoryId === catId)
      : this.products();
  });
}
```

---

## Services: Domain-Driven Naming

### ✅ Angular 20 Convention

**Drop generic `.service.ts` suffix!** Use domain-driven, intent-first names.

**File Naming Patterns:**

| Pattern | Purpose | Example |
|---------|---------|---------|
| `*-api.ts` | External API calls | `user-api.ts` → `UserApi` |
| `*-store.ts` | State management | `auth-store.ts` → `AuthStore` |
| `*-client.ts` | Low-level client/SDK | `payment-client.ts` → `PaymentClient` |
| `*-adapter.ts` | Data transformation | `user-adapter.ts` → `UserAdapter` |
| `*-validator.ts` | Validation logic | `email-validator.ts` → `EmailValidator` |
| `*-formatter.ts` | Formatting logic | `currency-formatter.ts` → `CurrencyFormatter` |

**Class Naming:**
```typescript
// ✅ ANGULAR 20 - Domain-driven names
export class UserApi { }           // Handles API communication
export class AuthStore { }         // Manages reactive state
export class PaymentClient { }     // Low-level client/SDK
export class DataAdapter { }       // Data transformation
export class EmailValidator { }    // Validation logic

// ❌ OLD - Generic Service suffix
export class UserService { }       // Too generic
export class AuthService { }       // What does it do?
```

### Complete Examples

#### API Service
```typescript
// File: product-api.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductApi {  // ✅ NO Service suffix
  private http = inject(HttpClient);
  private baseUrl = '/api/products';
  
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }
  
  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }
  
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product);
  }
}
```

#### State Store
```typescript
// File: product-store.ts
import { signalStore, withState, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ProductApi } from './product-api';

export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState({
    products: [] as Product[],
    loading: false,
    error: null as string | null
  }),
  withMethods((store, productApi = inject(ProductApi)) => ({
    async loadProducts() {
      patchState(store, { loading: true });
      try {
        const products = await firstValueFrom(productApi.getProducts());
        patchState(store, { products, loading: false, error: null });
      } catch (error) {
        patchState(store, { 
          loading: false, 
          error: 'Failed to load products' 
        });
      }
    }
  }))
);
```

---

## Directives: Keep the Suffix

### ✅ Angular 20 Convention

**Directives KEEP the `Directive` suffix** - helps distinguish from components.

**File Naming:**
```
highlight.ts                       ✅ Simplified filename
tooltip.ts                         ✅ Intent-first
highlight.directive.ts             ✅ Also acceptable (more explicit)
```

**Class Naming:**
```typescript
// ✅ ANGULAR 20 - KEEP Directive suffix
export class HighlightDirective { }    
export class TooltipDirective { }      
export class UnlessDirective { }       

// ❌ WRONG - Don't drop suffix
export class Highlight { }             
export class Tooltip { }               
```

**Selector Naming:**
```typescript
@Directive({
  selector: '[appHighlight]'       // ✅ lowerCamelCase with prefix
})
export class HighlightDirective { }
```

### Complete Example

```typescript
// File: highlight.ts
import { Directive, input, ElementRef, inject, effect } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {  // ✅ KEEP Directive suffix
  color = input<string>('yellow');
  private el = inject(ElementRef);
  
  constructor() {
    effect(() => {
      this.el.nativeElement.style.backgroundColor = this.color();
    });
  }
}

// Usage:
// <div appHighlight [color]="'lightblue'">Highlighted text</div>
```

---

## Pipes: Keep the Suffix

### ✅ Angular 20 Convention

**Pipes KEEP the `Pipe` suffix** in class name, and file keeps `.pipe.ts`.

**File Naming:**
```
date-ago.pipe.ts                   ✅ KEEP .pipe.ts suffix
currency-formatter.pipe.ts         ✅ Explicit and clear
```

**Class Naming:**
```typescript
// ✅ ANGULAR 20 - KEEP Pipe suffix
export class DateAgoPipe { }           
export class CurrencyFormatterPipe { } 
export class InitCapsPipe { }          

// ❌ WRONG - Don't drop suffix
export class DateAgo { }               
export class InitCaps { }              
```

**Template Name:**
```typescript
@Pipe({
  name: 'dateAgo'                  // ✅ lowerCamelCase, no hyphens
})
export class DateAgoPipe { }
```

### Complete Example

```typescript
// File: date-ago.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo'                  // ✅ lowerCamelCase for template
})
export class DateAgoPipe implements PipeTransform {  // ✅ KEEP Pipe suffix
  transform(value: Date): string {
    if (!value) return '';
    
    const seconds = Math.floor((new Date().getTime() - value.getTime()) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [name, secondsInInterval] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInInterval);
      if (interval >= 1) {
        return `${interval} ${name}${interval > 1 ? 's' : ''} ago`;
      }
    }
    
    return 'just now';
  }
}

// Usage:
// {{ createdAt | dateAgo }}  → "2 hours ago"
```

---

## Quick Reference Table

| Type | File Name | Class Name | Key Rule |
|------|-----------|------------|----------|
| **Component** | `user-profile.ts` | `UserProfile` | ❌ NO Component suffix |
| **Service** | `user-api.ts` | `UserApi` | ❌ NO Service suffix (domain-driven) |
| **Service** | `auth-store.ts` | `AuthStore` | ✅ Use domain suffix (Api, Store, Client) |
| **Directive** | `highlight.ts` | `HighlightDirective` | ✅ KEEP Directive suffix |
| **Pipe** | `date-ago.pipe.ts` | `DateAgoPipe` | ✅ KEEP Pipe suffix |
| **Interface** | `user.model.ts` | `User` | ✅ No suffix |
| **Type** | `types.ts` | `UserId` | ✅ No suffix |

---

# Part 2: Best Practices

## Component Architecture

### Use Signals for State

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <div>
      <p>Count: {{ count() }}</p>
      <p>Double: {{ double() }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  `
})
export class Counter {
  count = signal(0);
  double = computed(() => this.count() * 2);
  
  increment() {
    this.count.update(n => n + 1);
  }
}
```

### OnPush Change Detection

```typescript
@Component({
  selector: 'app-product-card',
  changeDetection: ChangeDetectionStrategy.OnPush,  // ✅ Always use OnPush
  template: `...`
})
export class ProductCard {
  product = input.required<Product>();
}
```

### Smart vs Presentational Components

**Smart Component (Container):**
```typescript
// File: product-list-container.ts
@Component({
  selector: 'app-product-list-container',
  template: `
    <app-product-list
      [products]="products()"
      [loading]="loading()"
      (productSelected)="onProductSelected($event)"
    />
  `
})
export class ProductListContainer {
  private productStore = inject(ProductStore);
  
  products = this.productStore.products;
  loading = this.productStore.loading;
  
  onProductSelected(product: Product) {
    // Handle navigation or state updates
  }
}
```

**Presentational Component:**
```typescript
// File: product-list.ts
@Component({
  selector: 'app-product-list',
  template: `
    @if (loading()) {
      <div>Loading...</div>
    } @else {
      @for (product of products(); track product.id) {
        <div (click)="productSelected.emit(product)">
          {{ product.name }}
        </div>
      }
    }
  `
})
export class ProductList {
  products = input.required<Product[]>();
  loading = input<boolean>(false);
  productSelected = output<Product>();
}
```

---

## Dependency Injection

### Use inject() Function

```typescript
// ✅ ANGULAR 20 - Use inject()
export class UserProfile {
  private userApi = inject(UserApi);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
}

// ❌ OLD - Constructor injection
export class UserProfile {
  constructor(
    private userApi: UserApi,
    private router: Router
  ) {}
}
```

### Provide in Root

```typescript
@Injectable({ providedIn: 'root' })  // ✅ Tree-shakable
export class UserApi {
  // ...
}
```

---

## State Management with Signals

### Local Component State

```typescript
export class TodoList {
  todos = signal<Todo[]>([]);
  filter = signal<'all' | 'active' | 'completed'>('all');
  
  filteredTodos = computed(() => {
    const currentFilter = this.filter();
    return this.todos().filter(todo => {
      if (currentFilter === 'active') return !todo.completed;
      if (currentFilter === 'completed') return todo.completed;
      return true;
    });
  });
  
  addTodo(text: string) {
    const newTodo = { id: Date.now(), text, completed: false };
    this.todos.update(todos => [...todos, newTodo]);
  }
  
  toggleTodo(id: number) {
    this.todos.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }
}
```

### Global State with SignalStore

```typescript
// File: todo-store.ts
import { signalStore, withState, withMethods, withComputed } from '@ngrx/signals';

export const TodoStore = signalStore(
  { providedIn: 'root' },
  withState({
    todos: [] as Todo[],
    filter: 'all' as 'all' | 'active' | 'completed'
  }),
  withComputed(({ todos, filter }) => ({
    filteredTodos: computed(() => {
      const currentFilter = filter();
      return todos().filter(todo => {
        if (currentFilter === 'active') return !todo.completed;
        if (currentFilter === 'completed') return todo.completed;
        return true;
      });
    }),
    activeCount: computed(() => 
      todos().filter(t => !t.completed).length
    )
  })),
  withMethods((store) => ({
    addTodo(text: string) {
      const newTodo = { id: Date.now(), text, completed: false };
      patchState(store, { todos: [...store.todos(), newTodo] });
    },
    setFilter(filter: 'all' | 'active' | 'completed') {
      patchState(store, { filter });
    }
  }))
);
```

---

## Reactive Programming

### Convert Observables to Signals

```typescript
import { toSignal } from '@angular/core/rxjs-interop';

export class UserProfile {
  private userApi = inject(UserApi);
  
  // Convert Observable to Signal
  user = toSignal(this.userApi.getUser(), { initialValue: null });
  
  // Use in computed
  displayName = computed(() => {
    const currentUser = this.user();
    return currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Guest';
  });
}
```

### Effects for Side Effects

```typescript
export class DataSync {
  private dataApi = inject(DataApi);
  
  userId = signal<string | null>(null);
  
  constructor() {
    // Effect runs when userId changes
    effect(() => {
      const id = this.userId();
      if (id) {
        this.dataApi.syncUserData(id).subscribe();
      }
    });
  }
}
```

---

## Forms

### Template-Driven with Signals

```typescript
@Component({
  imports: [FormsModule],
  template: `
    <input [(ngModel)]="name" />
    <p>Hello, {{ name() }}!</p>
  `
})
export class GreetingForm {
  name = signal('');
}
```

### Reactive Forms

```typescript
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email" />
      <input formControlName="password" type="password" />
      <button type="submit" [disabled]="form.invalid">Submit</button>
    </form>
  `
})
export class LoginForm {
  private fb = inject(FormBuilder);
  
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });
  
  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

---

## HTTP & API Integration

### Basic HTTP Calls

```typescript
// File: product-api.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductApi {
  private http = inject(HttpClient);
  
  getProducts() {
    return this.http.get<Product[]>('/api/products');
  }
  
  getProduct(id: string) {
    return this.http.get<Product>(`/api/products/${id}`);
  }
  
  createProduct(product: Product) {
    return this.http.post<Product>('/api/products', product);
  }
  
  updateProduct(id: string, product: Partial<Product>) {
    return this.http.patch<Product>(`/api/products/${id}`, product);
  }
  
  deleteProduct(id: string) {
    return this.http.delete(`/api/products/${id}`);
  }
}
```

### Error Handling

```typescript
import { catchError, retry } from 'rxjs/operators';
import { of } from 'rxjs';

export class ProductApi {
  getProducts() {
    return this.http.get<Product[]>('/api/products').pipe(
      retry(3),
      catchError(error => {
        console.error('Failed to load products:', error);
        return of([]);
      })
    );
  }
}
```

---

## Routing

### Route Configuration

```typescript
// File: app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home').then(m => m.Home)
  },
  {
    path: 'products',
    loadChildren: () => import('./products/product.routes').then(m => m.productRoutes)
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found').then(m => m.NotFound)
  }
];
```

### Navigation

```typescript
export class ProductList {
  private router = inject(Router);
  
  viewProduct(id: string) {
    this.router.navigate(['/products', id]);
  }
  
  goBack() {
    this.router.navigate(['..'], { relativeTo: this.activatedRoute });
  }
}
```

---

## Testing

### Component Testing

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Counter } from './counter';

describe('Counter', () => {
  let component: Counter;
  let fixture: ComponentFixture<Counter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Counter]
    }).compileComponents();

    fixture = TestBed.createComponent(Counter);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increment count', () => {
    expect(component.count()).toBe(0);
    component.increment();
    expect(component.count()).toBe(1);
  });

  it('should compute double correctly', () => {
    component.count.set(5);
    expect(component.double()).toBe(10);
  });
});
```

### Service Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductApi } from './product-api';

describe('ProductApi', () => {
  let service: ProductApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductApi]
    });

    service = TestBed.inject(ProductApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch products', () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Product 1', price: 100 }
    ];

    service.getProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('/api/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });
});
```

---

## Performance

### Lazy Loading

```typescript
// Route-level lazy loading
{
  path: 'products',
  loadChildren: () => import('./products/product.routes')
}

// Component-level lazy loading
const HeavyComponent = await import('./heavy-component').then(m => m.HeavyComponent);
```

### Virtual Scrolling

```typescript
import { CdkVirtualScrollViewport, CdkVirtualForOf } from '@angular/cdk/scrolling';

@Component({
  imports: [CdkVirtualScrollViewport, CdkVirtualForOf],
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      <div *cdkVirtualFor="let item of items()" class="item">
        {{ item.name }}
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [`
    .viewport {
      height: 400px;
      width: 100%;
    }
  `]
})
export class VirtualList {
  items = input.required<Item[]>();
}
```

### TrackBy Function

```typescript
@Component({
  template: `
    @for (item of items(); track trackById(item)) {
      <div>{{ item.name }}</div>
    }
  `
})
export class OptimizedList {
  items = input.required<Item[]>();
  
  trackById(item: Item): string {
    return item.id;
  }
}
```

---

## Accessibility

### ARIA Attributes

```typescript
@Component({
  template: `
    <button
      [attr.aria-label]="label()"
      [attr.aria-pressed]="isPressed()"
      [attr.aria-disabled]="disabled()"
      (click)="handleClick()"
    >
      {{ text() }}
    </button>
  `
})
export class AccessibleButton {
  label = input.required<string>();
  text = input<string>('');
  isPressed = input<boolean>(false);
  disabled = input<boolean>(false);
  clicked = output<void>();
  
  handleClick() {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }
}
```

### Keyboard Navigation

```typescript
@Component({
  template: `
    <div
      tabindex="0"
      (keydown.enter)="handleSelect()"
      (keydown.space)="handleSelect()"
      (click)="handleSelect()"
    >
      Selectable Item
    </div>
  `
})
export class KeyboardNavigable {
  selected = output<void>();
  
  handleSelect() {
    this.selected.emit();
  }
}
```

---

## Summary: Key Takeaways

### Naming Conventions
- ✅ Components: Drop Component suffix (`UserProfile`)
- ✅ Services: Domain-driven names (`UserApi`, `AuthStore`)
- ✅ Directives: Keep Directive suffix (`HighlightDirective`)
- ✅ Pipes: Keep Pipe suffix (`DateAgoPipe`)

### Best Practices
- ✅ Use signals for state management
- ✅ Use inject() for dependency injection
- ✅ Always use OnPush change detection
- ✅ Lazy load routes and heavy components
- ✅ Write comprehensive tests
- ✅ Follow accessibility guidelines

### Code Quality
- ✅ Type-safe (no `any` types)
- ✅ Proper error handling
- ✅ Clean, readable code
- ✅ Follow SOLID principles
- ✅ Document complex logic

---

**For more details on specific topics, refer to the relevant sections above.**

*Last Updated: December 7, 2025*
*Angular 20 Complete Guide*
