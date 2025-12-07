# Architecture Deep Dive - Apps, Libs & Module Federation

---

## 📦 Application Architecture

### Shell App - The Reference Implementation
**Location:** `apps/shell/`  
**Role:** Host application + reference patterns  
**Status:** Complete with 8 dashboards + 60+ widgets

#### Structure
```
apps/shell/src/app/
├── dashboard/              # 8 Dashboard Examples
│   ├── analytics/         # Analytics dashboard (charts, metrics)
│   ├── basic/             # Basic layout template
│   ├── dynamic/           # Dynamic widget loading
│   ├── ecommerce/         # E-commerce metrics
│   ├── explore/           # Exploration/discovery UI
│   ├── finance/           # Financial dashboard
│   ├── getting-started/   # Onboarding dashboard
│   └── ...
│
├── auth/                   # Complete Auth Flow
│   ├── signin/            # Sign in page
│   ├── signup/            # Sign up page
│   ├── forgot-password/   # Password recovery
│   └── verify-email/      # Email verification
│
├── widgets/                # Widget Examples
│   ├── _widgets/          # Individual widget components
│   │   ├── total-sales-widget/
│   │   ├── revenue-widget/
│   │   ├── top-products-widget/
│   │   └── ... (60+ widgets)
│   └── widget-gallery.ts  # Widget showcase page
│
├── components/             # Layout & Structural Components
│   ├── header/
│   ├── sidebar/
│   ├── footer/
│   └── ...
│
├── _partials/             # Reusable partials
├── _state/                # Global state
└── app.routes.ts          # Main routing
```

#### What to Learn from Shell
1. **Dashboard Layout** - See `dashboard/analytics/` for complete pattern
2. **Widget Implementation** - See `widgets/_widgets/` for widget patterns
3. **Auth Flow** - See `auth/` for authentication implementation
4. **Component Organization** - How to structure feature folders
5. **Styling** - Material Design 3 + Tailwind usage
6. **Responsive Design** - Mobile-first approach

#### Shell App Development Mode
```bash
npm start
# Runs shell at http://localhost:4200
# With webcomponents loaded at http://localhost:4201

# Or with specific app
npm start samba-web
npm start invoicely
```

---

### SAMBA ERP - Business Application
**Location:** `apps/samba-web/`  
**Role:** Main ERP application using widget-based dashboards  
**Architecture:** DDD + Module Federation consumer

#### Structure
```
apps/samba-web/src/app/
├── widgets/                # SAMBA-specific Widgets
│   ├── _widgets/          # Individual widgets
│   │   ├── total-sales-widget/
│   │   ├── revenue-widget/
│   │   ├── top-products-widget/
│   │   ├── inventory-status-widget/
│   │   └── ...
│   └── dashboard-page/    # Dashboard container
│
├── _cells/                 # Data Display Components
│   ├── product-cell/
│   ├── sale-cell/
│   └── ...
│
├── _partials/             # Layout Components
│   ├── header/
│   ├── sidebar/
│   └── ...
│
├── features/              # Feature Modules
│   ├── products/
│   ├── sales/
│   ├── inventory/
│   └── ...
│
├── _state/                # Global State
│   └── app.store.ts
│
└── app.routes.ts
```

#### SAMBA Architecture Philosophy
- **Widget-based UI** - All dashboards use Dashboard + individual widgets
- **Domain-driven** - Business logic in `@samba/*-domain` libraries
- **Modular** - Lazy-loaded feature modules
- **Reusable** - Components in `libs/shared/components`

#### How SAMBA Uses Architecture
```typescript
// Component uses domain stores (not services directly)
export class SalesPage {
  private saleStore = inject(SaleStore);           // From @samba/sale-domain
  private saleService = inject(SaleService);       // From @samba/sale-domain
  private productStore = inject(ProductStore);     // From @samba/product-domain

  // Data is reactive signals
  sales = this.saleStore.sales;        // Signal<Sale[]>
  products = this.productStore.products; // Signal<Product[]>

  // Create dashboard with individual metric widgets
  configs = signal<WidgetConfig[]>([
    { name: 'total-sales', component: TotalSalesWidget },
    { name: 'revenue', component: RevenueWidget },
    { name: 'top-products', component: TopProductsWidget },
  ]);
}
```

**Key Files to Study:**
- `apps/samba-web/CLAUDE.md` - Complete SAMBA guide
- `apps/samba-web/src/app/widgets/_widgets/` - Widget examples
- `libs/samba/domain/` - Domain libraries

---

### Invoicely - Invoice Management
**Location:** `apps/invoicely/`  
**Role:** Independent invoice management application  
**Architecture:** Simplified component-based (not widget-based)

#### Structure
```
apps/invoicely/src/app/
├── features/
│   ├── invoices/
│   │   ├── create-invoice/
│   │   ├── invoice-list/
│   │   ├── invoice-detail/
│   │   └── invoice-preview/
│   ├── customers/
│   ├── products/
│   └── ...
│
├── _shared/
│   ├── components/
│   │   ├── app-header/
│   │   ├── app-sidebar/
│   │   └── ...
│   └── layouts/
│       ├── auth-layout/
│       └── main-layout/
│
├── auth/
│   ├── signin/
│   ├── signup/
│   └── ...
│
└── app.routes.ts
```

#### Invoicely Architecture Philosophy
- **Feature-based** - Organized by business domains
- **Layout-based** - Uses Layout components for structure
- **Form-heavy** - Lots of FormRenderer usage
- **Simpler** - No complex dashboards, focused on core functionality

---

### WebComponents App - Module Federation Source
**Location:** `apps/webcomponents/`  
**Role:** Exposes 60+ components via Module Federation  
**Consumers:** Any MFE can load and use these components

#### Structure
```
apps/webcomponents/src/app/
├── lib/
│   ├── components/        # 60+ components exposed
│   ├── services/
│   └── models/
│
└── app.module.ts
```

#### Module Federation Config
**File:** `apps/webcomponents/module-federation.config.ts`

```typescript
export const remoteEntry = {
  name: 'webcomponents',
  filename: 'remoteEntry.js',
  exposes: {
    './Header': 'apps/webcomponents/src/app/components/header/header.ts',
    './Footer': 'apps/webcomponents/src/app/components/footer/footer.ts',
    // ... 60+ more exposed components
  },
};
```

#### All Exposed Components
- `Header`, `Footer`, `Sidenav`, `SettingsDrawer`
- `Breadcrumbs`, `Drawer`, `Sidebar`, `Layout`, `Panel`
- `Avatar`, `Carousel`, `Timeline`, `Icon`
- `DataTable`, `DataView`, `Skeleton`
- `Alert`, `Announcement`, `BlockLoader`, `Popover`
- `TextEditor`, `CodeHighlighter`, `ImageViewer`
- `Stepper`, `Tabs`, `Dialog`, `ModalDialog`
- `FormRenderer`, `CheckboxCard`, `RadioCard`
- `Gauge`, `MicroChart`, `Chart` (echarts)
- ... and more

---

## 📚 Library Architecture (Shared Code)

### `libs/shared/components/` - 100+ UI Components
**Type:** Shared component library  
**Technology:** Angular 20 + Material 3 + Tailwind  
**Distribution:** npm package `@ng-mf/components`

#### Structure
```
libs/shared/components/src/lib/
├── dashboard/              # Widget-based dashboard system
├── layout/                 # Layout components
│   ├── layout/
│   ├── sidebar/
│   ├── panel/
│   └── drawer/
│
├── data-display/           # Data visualization
│   ├── datatable/         # TanStack Table
│   ├── data-view/         # Material data view
│   ├── carousel/
│   ├── timeline/
│   └── avatar/
│
├── form/                   # Form components
│   ├── form-renderer/     # Dynamic forms
│   ├── country-select/
│   ├── phone-input/
│   ├── password-strength/
│   └── signature-pad/
│
├── feedback/               # User feedback
│   ├── alert/
│   ├── announcement/
│   ├── block-loader/
│   ├── confirm/           # Confirm dialogs
│   └── popover/
│
├── editor/                 # Content editors
│   ├── text-editor/       # Tiptap-based
│   ├── markdown-editor/
│   ├── code-highlighter/
│   └── content-editor/
│
├── media/                  # Media handling
│   ├── image-viewer/
│   ├── image-resizer/
│   ├── upload/
│   └── dicebear/
│
├── specialized/            # Domain-specific
│   ├── invoice-builder/
│   ├── kanban-board/
│   ├── course-builder/
│   ├── calendar/
│   └── color-picker/
│
└── index.ts               # Barrel export
```

#### How to Use Shared Components
```typescript
// Import from barrel
import {
  Dashboard, WidgetConfig, WidgetItem,
  Datatable, DatatableColumn,
  FormRenderer,
  Panel,
  Alert,
  ConfirmManager,
} from '@ng-mf/components';

@Component({
  imports: [Dashboard, Datatable, FormRenderer, Panel, Alert],
})
export class MyFeature { } // Angular 20: NO Component suffix
```

#### Adding New Shared Component
1. Create in `libs/shared/components/src/lib/<category>/<component>/`
2. Export from `libs/shared/components/src/lib/<category>/index.ts`
3. Export from `libs/shared/components/src/index.ts`
4. Update `COMPONENT-MAPPING.md`
5. Use in applications via `@ng-mf/components`

---

### `libs/shared/styles/` - Styling System
**Type:** Global styles & Tailwind configuration  
**Files:**
- `tailwind.config.ts` - Tailwind setup
- `globals.scss` - Global styles
- `_variables.scss` - CSS variables
- `_utilities.scss` - Utility classes

#### Material Design 3 Integration
- CSS variables for colors (e.g., `--md-sys-color-primary`)
- Uses Angular Material theme tokens
- Tailwind configured for Material colors

---

### `libs/shared/ui-theme/` - Theming System
**Type:** Material 3 theme configuration  
**Purpose:** Unified theming across all applications

#### Features
- Dark/light mode support
- Color scheme customization
- Material Design 3 compliance
- CSS variables for dynamic theming

---

### `libs/samba/domain/` - Domain-Driven Libraries
**Type:** Business logic + state management  
**Architecture:** Signal-based state with NgRx Signal Store

#### Structure
```
libs/samba/domain/
├── user/                   # User & Authentication
│   ├── store/             # User state
│   ├── services/          # User services
│   ├── models/            # User types
│   └── index.ts
│
├── product/                # Product Catalog
│   ├── store/
│   ├── services/
│   ├── models/
│   └── index.ts
│
├── inventory/              # Stock Management
│   ├── store/
│   ├── services/
│   ├── models/
│   └── index.ts
│
├── sale/                   # Sales Transactions
│   ├── store/
│   ├── services/
│   ├── models/
│   └── index.ts
│
├── customer/               # Customer Management
│   ├── store/
│   ├── services/
│   ├── models/
│   └── index.ts
│
├── branch/                 # Multi-branch Support
│   ├── store/
│   ├── services/
│   ├── models/
│   └── index.ts
│
└── category/               # Product Categories
    ├── store/
    ├── services/
    ├── models/
    └── index.ts
```

#### Domain Library Pattern
```typescript
// @samba/product-domain

// 1. Models
export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
}

// 2. Store (State)
export const ProductStore = signalStore(
  { providedIn: 'root' },
  withState<ProductState>({ products: [], selectedProduct: null }),
  withComputed(store => ({
    count: computed(() => store.products().length),
  })),
  withMethods(store => ({
    addProduct(product: Product) {
      patchState(store, { products: [...store.products(), product] });
    },
  }))
);

// 3. Service (Business Logic)
@Injectable({ providedIn: 'root' })
export class ProductApi { // Angular 20: Domain-driven naming (Api for external calls)
  private http = inject(HttpClient);

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }

  create(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>('/api/products', product);
  }
}

// 4. Index (Barrel Export)
export * from './models/product.model';
export * from './store/product.store';
export * from './services/product.service';
```

#### Using Domain Libraries
```typescript
// In any component
export class ProductList {
  private store = inject(ProductStore);
  private service = inject(ProductService);

  products = this.store.products;      // Reactive signal
  count = this.store.count;            // Computed

  ngOnInit() {
    this.service.getAll().subscribe(
      products => this.store.setProducts(products)
    );
  }
}
```

---

### `libs/samba/infrastructure/` - Shared Services
**Type:** Cross-domain infrastructure  
**Purpose:** HTTP clients, utilities, error handling

---

## 🔄 Module Federation Architecture

### How Module Federation Works

```
┌─────────────────────────────────────────┐
│         Shell App (Host)                │
│  Port: 4200                             │
│  - Loads remotes dynamically            │
│  - Provides shared dependencies         │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│  Shared Dependencies (Module Fed)       │
│  - @angular/*                           │
│  - rxjs                                 │
│  - @ng-mf/components                    │
│  - @samba/* domain libraries            │
└─────────────────────────────────────────┘
           ↓
   ┌───────────────┬──────────────────┐
   ↓               ↓                  ↓
┌──────────┐  ┌─────────────┐  ┌──────────────┐
│ SAMBA    │  │  Invoicely  │  │ WebComponents│
│ Web      │  │             │  │              │
│Port 4201 │  │ Port 4202   │  │ Port 4201    │
└──────────┘  └─────────────┘  └──────────────┘
(Remote)      (Remote)         (Remote)
```

### Module Federation Files

#### Host Configuration (Shell)
**File:** `apps/shell/webpack.config.ts`

```typescript
export const mfeConfig = withModuleFederation({
  name: 'shell',
  remotes: [
    ['samba-web', 'http://localhost:4201'],
    ['invoicely', 'http://localhost:4202'],
    ['webcomponents', 'http://localhost:4201'],
  ],
  shared: shareAll({
    singleton: true,
    strictVersion: false,
    requiredVersion: false,
  }),
});
```

#### Remote Configuration
**File:** `apps/samba-web/module-federation.config.ts`

```typescript
export const mfeConfig = {
  name: 'samba-web',
  remoteEntry: 'remoteEntry.js',
  exposes: {
    './Page': 'apps/samba-web/src/app/pages/index.ts',
    './SalesDashboard': 'apps/samba-web/src/app/dashboard/sales-dashboard.ts',
  },
  shared: shareAll({...}),
};
```

### Loading Remote Components

```typescript
// Dynamic loading at runtime
import { loadRemote } from '@nx/core/remoteEntry';

// Load remote component
const RemoteComponent = await loadRemote<typeof import('samba-web/SalesDashboard')>(
  'samba-web/SalesDashboard'
);

// Use with NgComponentOutlet
<ng-container
  [ngComponentOutlet]="RemoteComponent"
  [ngComponentOutletInputs]="{ data: myData }" />
```

### Shared Dependencies

All applications share:
- Angular core (`@angular/*`)
- RxJS
- @ngrx/signals
- @ng-mf/components
- @samba/domain libraries
- Angular Material
- Tailwind CSS

This ensures:
- No duplication of code
- Consistent versions
- Smaller bundle sizes
- Faster load times

---

## 🎯 Development Workflow

### Starting Development

```bash
# Terminal 1: Start shell + webcomponents
npm start

# Terminal 2: Start SAMBA ERP
npm start samba-web

# Terminal 3: Start Invoicely
npm start invoicely

# Terminal 4: Start mock API (SAMBA)
npm run mock-api
```

### Architecture Decision Tree

```
Need to create something?
│
├─→ Is it a UI component?
│   └─→ Check shell app first
│       └─→ Check shared components
│           └─→ Create if needed
│
├─→ Is it business logic?
│   └─→ Add to @samba/*-domain
│       └─→ Use in components via store
│
├─→ Is it page/feature?
│   └─→ Use existing app structure
│       └─→ Import shared components
│           └─→ Inject domain stores
│
└─→ Is it styling?
    └─→ Use Tailwind classes
        └─→ Follow Material Design 3
            └─→ Use CSS variables
```

---

## 📊 Component Hierarchy

```
Shell App (MFE Host)
│
├── Auth Flow
│   ├── SignIn
│   ├── SignUp
│   ├── ForgotPassword
│   └── VerifyEmail
│
├── Dashboard Pages
│   ├── Analytics Dashboard (shell pattern)
│   ├── Basic Dashboard
│   ├── Dynamic Dashboard
│   ├── Finance Dashboard
│   └── ... (8 total)
│
└── Remote Applications
    ├── SAMBA Web
    │   ├── Sales Dashboard
    │   ├── Inventory Management
    │   ├── Product Catalog
    │   └── Customer Management
    │
    ├── Invoicely
    │   ├── Invoice List
    │   ├── Create Invoice
    │   ├── Invoice Detail
    │   └── Customer Management
    │
    └── WebComponents
        └── 60+ components exposed
            ├── Layout Components
            ├── Data Display
            ├── Forms
            ├── Feedback
            ├── Editors
            └── Specialized

Shared Layer
│
├── UI Components (@ng-mf/components)
│   ├── Dashboard system
│   ├── 100+ components
│   └── Reusable patterns
│
├── Domain Libraries (@samba/*)
│   ├── User domain
│   ├── Product domain
│   ├── Sale domain
│   ├── Customer domain
│   ├── Inventory domain
│   └── ... (7 domains)
│
└── Styling System
    ├── Tailwind config
    ├── Material 3 theme
    └── Global styles
```

---

## 🔐 Best Practices

### 1. Always Use Shared Components First
```typescript
// ✅ DO
import { Dashboard, Datatable, FormRenderer } from '@ng-mf/components';

// ❌ DON'T
// Create custom components when shared exists
```

### 2. Reference Shell App for Patterns
```typescript
// ✅ DO
// Check apps/shell/src/app/dashboard/analytics/ for similar pattern

// ❌ DON'T
// Invent new patterns
```

### 3. Use Domain Stores for Business Logic
```typescript
// ✅ DO
const store = inject(ProductStore);
const products = store.products;  // Signal

// ❌ DON'T
// Call services directly everywhere
```

### 4. Keep Components Focused
- One responsibility per component
- Use composition over inheritance
- Extract reusable patterns to shared library

### 5. Maintain Folder Structure
- Feature-based or domain-based organization
- Consistent naming conventions
- Clear separation of concerns

---

**Reference these docs when working on architecture decisions.**
