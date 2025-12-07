# Claude AI System Context - Nx Angular 20 MFE Boilerplate

> **Purpose**: This document provides the complete technical context for the workspace, including technologies, tools, patterns, and available libraries.

**Last Updated:** December 7, 2025

---

## 📊 Technology Versions

| Technology | Version | Purpose |
|------------|---------|---------|
| **Angular** | 20.3.0 | Frontend framework |
| **Nx** | 22.0.2 | Monorepo tooling |
| **TypeScript** | 5.9.2 | Type safety |
| **Tailwind CSS** | 4.1.16 | Utility-first CSS |
| **Angular Material** | 20.2.10 | Material Design components |
| **RxJS** | 7.8.0 | Reactive programming |
| **NgRx Signals** | 20.1.0 | State management |
| **Vitest** | 3.0.0 | Unit testing |
| **Playwright** | 1.36.0 | E2E testing |
| **ECharts** | 6.0.0 | Data visualization |
| **Module Federation** | 0.18.0 | Micro-frontends |
| **Vite** | 7.0.0 | Development server |
| **ESLint** | 9.8.0 | Code linting |
| **Prettier** | 2.6.2 | Code formatting |

---

## 🎯 Your Mission

You are a **senior software engineer** working in a production-grade Nx monorepo with sophisticated module federation architecture. Your role is to:

1. **Leverage existing code** - 100+ UI components, domain libraries, and reference implementations exist
2. **Maintain consistency** - Follow established patterns without reinventing solutions
3. **Act autonomously** - Understand context deeply enough to make decisions independently
4. **Optimize for reuse** - Use shared libraries, avoid duplication, reference shell app patterns
5. **Follow best practices** - Angular 20, Signals, standalone components, DDD architecture

**You are NOT a freelancer** - no repeated instructions, understand the architecture deeply.

---

## 📚 Workspace Quick Reference

```
workspace/
├── apps/
│   ├── shell/              # 🌟 REFERENCE IMPLEMENTATION (8 dashboards, auth, 60+ widgets)
│   ├── samba-web/          # 🏢 SAMBA ERP Application (widget-based dashboards)
│   ├── invoicely/          # 📄 Invoice Management App
│   ├── webcomponents/      # 🧩 Exposed 60+ components via Module Federation
│   └── *-e2e/              # E2E test projects
│
├── libs/
│   ├── shared/components/  # ⭐ 100+ PRODUCTION-READY UI COMPONENTS
│   ├── shared/styles/      # Global styles & Tailwind
│   ├── shared/ui-theme/    # Material 3 theming system
│   └── samba/              # Domain-driven design libraries
│       ├── domain/         # Business logic (user, product, sale, etc.)
│       └── infrastructure/ # Shared services
│
└── Documentation/
    ├── CLAUDE.md (root)           # Main architectural guide
    ├── apps/samba-web/CLAUDE.md   # SAMBA-specific guide
    ├── ANGULAR-20-BEST-PRACTICES.md  # Coding standards
    └── COMPONENT-MAPPING.md       # 100+ component reference
```

---

## 🔍 Component Discovery - MANDATORY WORKFLOW

**🚨 CRITICAL: BEFORE writing ANY code, follow this discovery workflow:**

### ⚠️ Rule #1: NEVER Create What Already Exists

**We have 100+ production-ready components. USE THEM FIRST!**

```typescript
// ❌ DON'T DO THIS - Creating a component that already exists
export class MyCustomTable { /* ... */ }

// ✅ DO THIS - Use existing Datatable component
import { Datatable } from '@ng-mf/components';
```

**Discovery workflow (check in this exact order):**

### Step 1: Check Project-Specific Components
```bash
# SAMBA-specific components
apps/samba-web/src/app/widgets/_widgets/     # Existing widgets
apps/samba-web/src/app/_cells/                # Data display cells
apps/samba-web/src/app/_partials/             # Layout components

# Invoicely-specific components
apps/invoicely/src/app/...
```

### Step 2: Reference Shell App (Source of Truth)
```bash
apps/shell/src/app/
├── dashboard/         # 8 complete dashboard examples
│   ├── analytics/     # Analytics dashboard with charts
│   ├── basic/         # Basic layout pattern
│   ├── dynamic/       # Dynamic widget loading
│   ├── ecommerce/     # E-commerce metrics
│   ├── explore/       # Exploration UI
│   ├── finance/       # Financial dashboard
│   └── getting-started/ # Onboarding
├── auth/              # Complete auth flow (signin, signup, forgot-password)
├── widgets/_widgets/  # 60+ widget examples
└── components/        # Layout & structural components
```

**Shell app is the DEFINITIVE reference for:**
- Dashboard layout patterns
- Widget implementations
- Auth flow & forms
- Styling & responsive design
- Component organization

### Step 3: Use Shared Component Library
**100+ production-ready components in `libs/shared/components/`**

#### Layout & Structure
```typescript
import {
  Dashboard,      // Widget-based dashboard system ⭐
  Panel,          // Collapsible panels
  Sidebar,        // Navigation sidebar
  Layout,         // Page layout
  Drawer,         // Side drawer
} from '@ng-mf/components';
```

#### Data Display
```typescript
import {
  Datatable,      // TanStack Table (feature-rich) ⭐
  DataView,       // Material-based data view
  Carousel,       // Image carousel
  Timeline,       // Event timeline
  Avatar,         // User avatars
} from '@ng-mf/components';
```

#### Forms & Input
```typescript
import {
  FormRenderer,        // Dynamic form builder ⭐
  CountrySelect,
  CurrencySelect,
  PhoneInput,
  PasswordStrength,
  SignaturePad,
} from '@ng-mf/components';
```

#### Feedback & UI
```typescript
import {
  Alert,
  Announcement,
  BlockLoader,
  ConfirmManager,  // For confirmations
  Popover,
  ColorPicker,
} from '@ng-mf/components';
```

#### Specialized Components
```typescript
import {
  TextEditor,           // Tiptap-based editor
  MarkdownEditor,
  CodeHighlighter,
  InvoiceBuilder,       // Invoice creation
  KanbanBoard,          // Kanban UI
  CourseBuilder,
  ImageViewer,
  ImageResizer,
} from '@ng-mf/components';
```

### Step 4: Use Angular Material (When Needed)
Only after checking shared components:
```typescript
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
```

### Step 5: Create Custom Components (Last Resort)
Only if no existing solution exists. Then:
- Follow shell app patterns exactly
- Use Tailwind CSS + Material Design tokens
- Document implementation
- Consider contributing to shared library

---

## 🏗️ Key Architectural Patterns

### 1. Widget-Based Architecture (MANDATORY for Dashboards)
**Used in:** SAMBA dashboards, analytics pages, reports

```typescript
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';
import { signal } from '@angular/core';

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [Dashboard, /* other components */],
  template: `<mf-dashboard [configs]="configs()" [items]="items()" />`,
})
export class SalesDashboard {
  // Define widget types
  configs = signal<WidgetConfig[]>([
    {
      name: 'total-sales',
      label: 'Total Sales',
      component: TotalSalesWidget, // Individual widget component
    },
    {
      name: 'revenue',
      label: 'Revenue',
      component: RevenueWidget,
    },
    {
      name: 'top-products',
      label: 'Top Products',
      component: TopProductsWidget,
    },
  ]);

  // Define grid layout (12-column grid)
  items = signal<WidgetItem[]>([
    { id: '1', name: 'total-sales', x: 0, y: 0, w: 3, h: 2 },
    { id: '2', name: 'revenue', x: 3, y: 0, w: 3, h: 2 },
    { id: '3', name: 'top-products', x: 0, y: 2, w: 6, h: 3 },
  ]);
}
```

**Widget Types (Individual, Not Grouped):**
- Metric widgets: `TotalSalesWidget`, `RevenueWidget`, `TotalProductsWidget`
- Chart widgets: Use echarts directly via `ChartWidget`
- Table widgets: Use `Datatable` component
- Custom widgets: Follow shell app patterns

### 2. Domain-Driven Design (SAMBA Architecture)
**Business logic separated from UI components**

```typescript
// Import domain libraries
import { ProductStore, ProductService } from '@samba/product-domain';
import { SaleStore, SaleService } from '@samba/sale-domain';
import { CustomerStore, CustomerService } from '@samba/customer-domain';

@Component({
  selector: 'app-sales-page',
  standalone: true,
  imports: [/* components */],
})
export class SalesPage {
  // Inject domain stores & services
  private productStore = inject(ProductStore);
  private saleStore = inject(SaleStore);
  private saleService = inject(SaleService);

  // Use reactive stores (Signals)
  products = this.productStore.products;      // Signal<Product[]>
  sales = this.saleStore.sales;                // Signal<Sale[]>
  selectedSale = this.saleStore.selectedSale; // Signal<Sale | null>

  // Domain methods for business operations
  createSale(saleData: CreateSaleDto): void {
    this.saleService.create(saleData).subscribe(
      sale => this.saleStore.addSale(sale)
    );
  }

  updateSale(id: number, updates: Partial<Sale>): void {
    this.saleStore.updateSale(id, updates);
  }
}
```

**Domain Libraries Available:**
- `@samba/user-domain` - Users, roles, permissions, authentication
- `@samba/product-domain` - Products, categories, variants
- `@samba/inventory-domain` - Stock levels, warehouse management
- `@samba/sale-domain` - Sales transactions, quotations
- `@samba/customer-domain` - Customer management
- `@samba/branch-domain` - Multi-branch support
- `@samba/category-domain` - Product categories

### 3. Module Federation (Microfrontends)
**Applications are independently deployable**

```typescript
// Host app (shell) loads remotes
import { loadRemote } from '@nx/core/remoteEntry';

// Dynamic component loading
const SambaComponent = await loadRemote<typeof import('samba-web/SalesPage')>(
  'samba-web/SalesPage'
);

// Use via NgComponentOutlet
<ng-container
  [ngComponentOutlet]="SambaComponent"
  [ngComponentOutletInputs]="{ data: myData }" />
```

---

## 📐 Development Standards

### File Naming (Angular 20 Simplified)
```
✅ DO:
  product-list.ts         # Component file
  product-list.html       # Template
  product-list.scss       # Styles
  product.service.ts      # Service (keep suffix)
  product.store.ts        # Store (keep suffix)

❌ DON'T:
  product-list.component.ts  # Old convention
  product-list.component.html
```

### Component Structure (Always Standalone)
```typescript
import { Component, Input, Output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedUIComponents } from '@ng-mf/components';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedUIComponents, // Import shared components
  ],
  templateUrl: './my-component.html',
  styleUrl: './my-component.scss',
  host: { class: 'block w-full' },
})
export class MyFeature { // Angular 20: NO Component suffix
  // 1. Injected dependencies (top)
  private store = inject(SomeStore);
  private api = inject(SomeApi); // Angular 20: Use domain-driven names

  // 2. Input/Output properties
  @Input() data?: any;
  @Output() selected = output<any>();

  // 3. Signals
  items = signal<Item[]>([]);
  isLoading = signal(false);

  // 4. Computed signals
  filteredItems = computed(() => {
    return this.items().filter(i => i.active);
  });

  // 5. Lifecycle hooks
  ngOnInit(): void {
    this.loadData();
  }

  // 6. Public methods
  loadData(): void {}

  // 7. Private methods
  private processData(): void {}
}
```

### Import Order
```typescript
// 1. Angular
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// 2. Angular Material
import { MatButton } from '@angular/material/button';

// 3. Shared libraries (@ng-mf/*, @samba/*)
import { Dashboard } from '@ng-mf/components';
import { ProductStore } from '@samba/product-domain';

// 4. Local components
import { ProductCard } from './product-card/product-card';

// 5. Services
import { AppService } from './app.service';

// 6. Models/Types
import { Product } from './models/product.model';
```

### State Management (Signals)
```typescript
// ✅ DO: Use Angular Signals (built-in)
const count = signal(0);
const doubled = computed(() => count() * 2);

// ✅ DO: Use NgRx Signal Store for complex state
const store = signalStore(
  { providedIn: 'root' },
  withState({ items: [] }),
  withComputed(store => ({
    count: computed(() => store.items().length),
  })),
  withMethods(store => ({
    addItem(item: any) { patchState(store, { items: [...store.items(), item] }); }
  }))
);

// ✅ DO: Use Domain Stores from @samba/* for business logic
const productStore = inject(ProductStore); // Already configured
```

### Forms
```typescript
// ✅ PREFER: FormRenderer for dynamic forms
import { FormRenderer } from '@ng-mf/components';

// ✅ DO: Use Reactive Forms for custom forms
const form = new FormGroup({
  name: new FormControl('', [Validators.required]),
  email: new FormControl('', [Validators.email]),
});

// ❌ AVOID: Template-driven forms
```

### HTTP & API
```typescript
// ✅ DO: Use HttpClient with domain-driven services
@Injectable({ providedIn: 'root' })
export class ProductApi { // Angular 20: Domain-driven naming
  private http = inject(HttpClient);

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }
}

// ✅ DO: Use stores to manage API data
export class ProductStore extends signalStore({
  providedIn: 'root'
}, withState({ products: [] })) {
  private productService = inject(ProductService);

  constructor() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getAll().subscribe(
      products => patchState(this, { products })
    );
  }
}
```

### Testing
```typescript
// ✅ DO: Use Vitest with Angular
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { MyComponent } from './my-component';

describe('MyComponent', () => {
  let component: MyComponent;

  beforeEach(() => {
    component = TestBed.createComponent(MyComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
```

---

## 🎨 Styling Standards

### Tailwind CSS + Material Design
```scss
// ✅ DO: Use Tailwind utilities
<div class="flex items-center gap-4 p-4 rounded-lg shadow-md bg-surface-50">
  <button class="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-900">
    Click me
  </button>
</div>

// ✅ DO: Use Material Design color tokens via CSS variables
$primary: var(--md-sys-color-primary);
$surface: var(--md-sys-color-surface);
$error: var(--md-sys-color-error);

// ✅ DO: Use host binding for component-level styles
@Component({
  host: {
    class: 'block rounded-lg p-4 bg-surface-50'
  }
})

// ❌ AVOID: Deep nesting in SCSS
// ✅ DO: Flat, utility-based styles
.card {
  @apply rounded-lg shadow-md p-4;

  &.active {
    @apply shadow-lg bg-primary-50;
  }
}
```

---

## 🚀 Commands Reference

```bash
# Development
npm start                    # Shell + webcomponents
npm start samba-web          # SAMBA ERP
npm start invoicely          # Invoicely

# Building
npx nx build <app>          # Build specific app
npx nx build --prod         # Production build

# Testing
npx nx test <app>           # Run tests
npx nx test --coverage      # With coverage

# Code Quality
npx nx lint <app>           # Lint check
npx nx format:check          # Check formatting

# E2E Tests
npx nx e2e <app>-e2e        # Run E2E tests

# Utilities
npx nx graph                 # Visualize dependency graph
npx nx list                  # List all projects
npx nx show project <app>    # Show project details
```

---

## 🔄 Workflow: Adding a New Feature

### 1. Analyze Requirements
- Check existing implementation in shell app
- Check SAMBA domain libraries for business logic
- Identify required shared components

### 2. Discover Components
- Search shared library (`libs/shared/components/`)
- Check shell app examples
- Determine if custom component needed

### 3. Design Data Flow
- Use domain stores from `@samba/*/domain`
- Leverage signals for reactivity
- Plan state management

### 4. Implement Component
- Copy shell app pattern
- Use shared components
- Follow file naming conventions
- Add to proper folder structure

### 5. Test
- Unit tests with Vitest
- E2E tests with Playwright
- Manual testing in development

### 6. Document
- Add code comments
- Update relevant CLAUDE.md if needed
- Document if creating reusable component

---

## 📖 Documentation Structure

**Root Level** - Workspace & Strategic Docs
- `CLAUDE.md` - Main architectural guide
- `ANGULAR-20-BEST-PRACTICES.md` - Coding standards
- `COMPONENT-MAPPING.md` - 100+ component reference

**App Level** - App-Specific Guides
- `apps/samba-web/CLAUDE.md` - SAMBA ERP development guide
- `apps/shell/` - Reference implementation (no docs needed, code IS docs)

**Library Level** - Domain & UI Guides
- `libs/shared/components/` - 100+ UI components (discoverable via imports)
- `libs/samba/*/domain/` - Domain libraries with TypeScript definitions

---

## 💡 Common Scenarios

### Scenario 1: Adding New Dashboard Widget
1. Check `apps/shell/src/app/widgets/_widgets/` for examples
2. Create new widget component in `apps/samba-web/src/app/widgets/_widgets/`
3. Import widget in parent dashboard component
4. Add to widget config in dashboard page

### Scenario 2: Building Data Form
1. Check `apps/shell/src/app/components/` for form patterns
2. Use `FormRenderer` from shared library OR create reactive form
3. Inject domain service (e.g., `ProductService`)
4. Handle submission & state updates through store

### Scenario 3: Creating New Page
1. Reference `apps/shell/src/app/dashboard/analytics/` or similar
2. Use shared layout components (`Dashboard`, `Panel`, `Datatable`)
3. Import domain stores for data
4. Add route to app routing configuration

### Scenario 4: Adding Shared Component
1. Check if similar component exists
2. Create in `libs/shared/components/src/lib/`
3. Export from barrel file
4. Add to `COMPONENT-MAPPING.md`
5. Use in applications via `@ng-mf/components`

---

## 🎯 Key Principles

1. **DRY (Don't Repeat Yourself)**
   - Shared components first
   - Domain libraries for business logic
   - Shell app as reference

2. **Consistency**
   - Follow established patterns
   - Use shared styling system
   - Maintain file organization

3. **Performance**
   - Lazy load widgets
   - Use OnPush change detection
   - Optimize signals usage

4. **Maintainability**
   - Clear folder structure
   - Descriptive naming
   - Proper documentation

5. **Scalability**
   - Modular architecture
   - Independent deployability
   - Reusable components

---

## 📞 When to Ask for Clarification

Ask if:
- Requirements conflict with established patterns
- Custom solution needed despite existing components
- Architectural decision needed
- Performance concerns arise

Don't ask for:
- Same instruction twice (context stored)
- Existing pattern/component location (check docs)
- Basic coding questions (covered in best practices)
- Component APIs (check COMPONENT-MAPPING.md)

---

## ✅ Verification Checklist

Before considering work complete:

- [ ] Used existing components where possible
- [ ] Followed shell app pattern if applicable
- [ ] Used domain stores for business logic
- [ ] Followed file naming conventions
- [ ] Component is standalone with proper imports
- [ ] Signals used for reactivity
- [ ] Tests added/updated
- [ ] No console errors or warnings
- [ ] Responsive design verified
- [ ] Accessibility considered

---

**Last Updated:** December 6, 2025  
**Status:** ✅ Production Ready  
**Version:** 2.0
