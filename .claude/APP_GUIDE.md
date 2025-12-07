# App Implementation Guide

Quick reference for implementing features in each application.

---

## 🎯 Shell App - Reference Implementation

**Location:** `apps/shell/`  
**Use:** Learn patterns, don't modify for production

### When to Reference Shell App
- ✅ Dashboard layout patterns
- ✅ Widget implementation examples
- ✅ Auth flow implementation
- ✅ Component styling standards
- ✅ Responsive design patterns
- ✅ Material Design 3 usage

### Shell App Structure to Study
```
apps/shell/src/app/
├── dashboard/
│   └── analytics/          # 👈 STUDY THIS PATTERN
│       ├── analytics.ts    # Dashboard component
│       ├── analytics.html  # Template
│       ├── analytics.scss  # Styling
│       └── widgets/        # Child widgets
│
├── auth/
│   ├── signin/            # 👈 AUTH FLOW PATTERN
│   ├── signup/
│   └── forgot-password/
│
└── widgets/_widgets/       # 👈 WIDGET EXAMPLES
    ├── total-sales-widget/
    ├── revenue-widget/
    └── ... (60+ examples)
```

### Key Shell App Files to Study First
1. `apps/shell/src/app/dashboard/analytics/analytics.ts` - Dashboard pattern
2. `apps/shell/src/app/widgets/_widgets/total-sales-widget/` - Widget pattern
3. `apps/shell/src/app/auth/signin/signin.ts` - Form pattern

### Commands
```bash
npm start
# Opens shell at http://localhost:4200
# Study the UI/patterns while code is running
```

---

## 🏢 SAMBA ERP - Main Application

**Location:** `apps/samba-web/`  
**Purpose:** Business automation platform  
**Architecture:** Widget-based dashboards + Domain-driven design

### When Implementing in SAMBA

#### 1. Dashboard/Analytics Pages
```typescript
// Pattern from shell app → apply to SAMBA
// Use Dashboard component with individual metric widgets

@Component({
  imports: [Dashboard, TotalSalesWidget, RevenueWidget, TopProductsWidget]
})
export class SalesDashboard {
  // Get data from domain stores
  private saleStore = inject(SaleStore);

  configs = signal([
    { name: 'total-sales', component: TotalSalesWidget },
    { name: 'revenue', component: RevenueWidget },
    { name: 'top-products', component: TopProductsWidget },
  ]);

  items = signal([
    { id: '1', name: 'total-sales', x: 0, y: 0, w: 3, h: 2 },
    { id: '2', name: 'revenue', x: 3, y: 0, w: 3, h: 2 },
    { id: '3', name: 'top-products', x: 0, y: 2, w: 6, h: 4 },
  ]);
}
```

#### 2. Data Management Pages
```typescript
// Use Datatable component from shared library
import { Datatable } from '@ng-mf/components';
import { ProductStore } from '@samba/product-domain';

@Component({
  imports: [Datatable, CommonModule, MatButton]
})
export class ProductList {
  private store = inject(ProductStore);
  products = this.store.products;  // Signal from store

  columns: DatatableColumn[] = [
    { id: 'name', header: 'Product', cell: (r: any) => r.name },
    { id: 'price', header: 'Price', cell: (r: any) => `$${r.price}` },
    { id: 'stock', header: 'Stock', cell: (r: any) => r.stockLevel },
  ];

  onAddProduct() { /* open form */ }
  onEdit(row: any) { /* edit product */ }
  onDelete(row: any) { /* delete product */ }
}
```

#### 3. Forms & Data Entry
```typescript
// Use FormRenderer for dynamic forms
import { FormRenderer } from '@ng-mf/components';
import { ProductService } from '@samba/product-domain';

@Component({
  imports: [FormRenderer, CommonModule]
})
export class CreateProduct {
  private service = inject(ProductService);
  private store = inject(ProductStore);

  formSchema = signal([
    { name: 'name', label: 'Product Name', type: 'text', required: true },
    { name: 'price', label: 'Price', type: 'number', required: true },
    { name: 'categoryId', label: 'Category', type: 'select', options: [] },
  ]);

  onSubmit(data: any) {
    this.service.create(data).subscribe(
      product => this.store.addProduct(product)
    );
  }
}
```

### SAMBA Implementation Checklist
- [ ] Used domain store (ProductStore, SaleStore, etc.)
- [ ] Dashboard uses individual metric widgets (not grouped)
- [ ] Forms use FormRenderer or reactive forms
- [ ] Data tables use shared Datatable component
- [ ] Follows shell app styling patterns
- [ ] Uses Material Design 3 + Tailwind

### Important SAMBA Rules
1. **Widget-based dashboards** - Always Dashboard + individual widgets
2. **No grouped widgets** - Each metric is its own widget
3. **Domain-driven** - Get data from @samba/* stores
4. **Signals all the way** - Use reactive signals for state
5. **Reference shell** - Match shell app patterns exactly

### SAMBA Key Files
- **Guide:** `apps/samba-web/CLAUDE.md` - Complete SAMBA guide
- **Widgets:** `apps/samba-web/src/app/widgets/_widgets/` - Example widgets
- **Cells:** `apps/samba-web/src/app/_cells/` - Data display cells
- **Partials:** `apps/samba-web/src/app/_partials/` - Layout components

### SAMBA Commands
```bash
npm start samba-web
# Opens SAMBA at http://localhost:4201

npm run mock-api
# Starts mock API server for development
```

---

## 📄 Invoicely - Invoice Management App

**Location:** `apps/invoicely/`  
**Purpose:** Standalone invoice management  
**Architecture:** Simpler, component-based (no complex dashboards)

### When Implementing in Invoicely

#### 1. Feature Module Setup
```typescript
// Location: apps/invoicely/src/app/features/invoices/

export const invoicesRoutes: Routes = [
  {
    path: '',
    component: InvoiceListPage,
  },
  {
    path: 'new',
    component: CreateInvoicePage,
  },
  {
    path: ':id',
    component: InvoiceDetailPage,
  },
];
```

#### 2. List Page with Datatable
```typescript
@Component({
  selector: 'app-invoice-list',
  imports: [Datatable, MatButton, CommonModule]
})
export class InvoiceListPage {
  private invoiceService = inject(InvoiceService);

  invoices = signal<Invoice[]>([]);
  isLoading = signal(false);

  ngOnInit() {
    this.loadInvoices();
  }

  loadInvoices() {
    this.isLoading.set(true);
    this.invoiceService.getAll().subscribe(
      invoices => this.invoices.set(invoices)
    );
  }

  onView(invoice: Invoice) {
    this.router.navigate(['/invoices', invoice.id]);
  }
}
```

#### 3. Create/Edit Form
```typescript
@Component({
  imports: [FormRenderer, ReactiveFormsModule, MatButton, CommonModule]
})
export class CreateInvoicePage {
  private formBuilder = new FormBuilder();
  private service = inject(InvoiceService);

  form = this.formBuilder.group({
    invoiceNumber: ['', Validators.required],
    customerName: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0)]],
    dueDate: ['', Validators.required],
  });

  onSubmit() {
    if (this.form.valid) {
      this.service.create(this.form.value).subscribe(() => {
        this.router.navigate(['/invoices']);
      });
    }
  }
}
```

### Invoicely Implementation Checklist
- [ ] Used services (not stores - simpler app)
- [ ] Forms use reactive forms or FormRenderer
- [ ] List uses shared Datatable component
- [ ] Detail page has view + edit functionality
- [ ] PDF export/preview functionality if needed
- [ ] Follows shared component patterns

### Important Invoicely Considerations
1. **Simpler than SAMBA** - Focus on core features
2. **Form-heavy** - Lots of FormRenderer usage
3. **Service-based** - Not as complex as domain stores
4. **Feature-oriented** - Organized by business domains
5. **Reusable components** - Use shared library

### Invoicely Key Paths
- **Features:** `apps/invoicely/src/app/features/`
- **Shared:** `apps/invoicely/src/app/_shared/`
- **Layouts:** `apps/invoicely/src/app/_shared/layouts/`

### Invoicely Commands
```bash
npm start invoicely
# Opens Invoicely at http://localhost:4202
```

---

## 🧩 WebComponents - Exposed Component Library

**Location:** `apps/webcomponents/`  
**Purpose:** Expose components via Module Federation  
**Status:** Already configured with 60+ components

### When to Use WebComponents
- ✅ Loading components from other MFEs
- ✅ Reference existing component implementations
- ❌ NOT for regular development (they're exposed remotely)

### Using WebComponents in Other Apps
```typescript
// In shell app or other remotes
import { loadRemote } from '@nx/core/remoteEntry';

// Dynamic loading
const IconComponent = await loadRemote<typeof import('webcomponents/Icon')>(
  'webcomponents/Icon'
);

// Use with NgComponentOutlet
<ng-container
  [ngComponentOutlet]="IconComponent"
  [ngComponentOutletInputs]="{ name: 'home' }" />
```

### All Exposed Components
See `COMPONENT-MAPPING.md` in root for complete list.

---

## 🔄 Implementation Workflow by App

### Workflow: Add Feature to SAMBA
1. **Analyze:** Check if dashboard, form, or list
2. **Reference:** Find similar in shell app
3. **Create:** Use appropriate template from QUICK_REFERENCE
4. **Components:** Use shared components
5. **Data:** Use @samba/* domain stores
6. **Style:** Follow shell patterns
7. **Test:** Verify responsiveness & functionality

### Workflow: Add Feature to Invoicely
1. **Plan:** Create folder structure
2. **Reference:** Check Invoicely patterns
3. **Components:** Use shared components
4. **Forms:** Use FormRenderer or reactive forms
5. **Services:** Create local services
6. **Style:** Use shared styles
7. **Test:** E2E testing

### Workflow: Create Shared Component
1. **Location:** `libs/shared/components/src/lib/<category>/<component>/`
2. **Template:** Standalone component
3. **Exports:** Add to barrel files
4. **Reference:** Document in COMPONENT-MAPPING.md
5. **Testing:** Write tests
6. **Import:** Use in apps via `@ng-mf/components`

---

## 📊 State Management by App

### Shell App
- Simple signals
- No complex state management
- Example-only

### SAMBA
- Domain stores (@samba/*-domain)
- NgRx Signal Store
- Signals everywhere

### Invoicely
- Local services
- Simple signals
- No complex state

### Shared Components
- Standalone
- No internal state
- Accept inputs/outputs

---

## 🎨 Styling by App

### Consistency
All apps use the same:
- Tailwind CSS 4
- Material Design 3
- CSS variables
- Global styles from `libs/shared/styles/`

### Component Styling
```scss
// Always use host binding
@Component({
  host: { class: 'block rounded-lg p-4' }
})

// Then scoped styles
:host {
  display: flex;
  flex-direction: column;
}

// Utility classes for layout
.card {
  @apply rounded-lg shadow-md p-4 bg-surface-50;

  &.active {
    @apply shadow-lg border border-primary;
  }
}
```

---

## ⚡ Performance Considerations

### By App Type

**Shell (Host):**
- Lazy load remote applications
- Preload if user might navigate

**SAMBA (Remote):**
- Lazy load feature modules
- Use OnPush change detection
- Optimize signals usage

**Invoicely (Remote):**
- Code splitting per feature
- Lazy load heavy components
- Optimize bundle size

**Shared Components:**
- Tree-shakeable exports
- Optimized for reuse
- Minimal dependencies

---

## 🧪 Testing by App

### Shell App Testing
```bash
npx nx test shell
npx nx e2e shell-e2e
```

### SAMBA Testing
```bash
npx nx test samba-web
npx nx e2e samba-web-e2e
```

### Invoicely Testing
```bash
npx nx test invoicely
npx nx e2e invoicely-e2e
```

---

## 📋 Quick Decision Table

| Need to... | Use/Check | Location |
|-----------|-----------|----------|
| Build dashboard | Shell analytics pattern | `apps/shell/src/app/dashboard/analytics/` |
| Create widget | Widget template | QUICK_REFERENCE |
| Build form | FormRenderer or reactive | Shell/components or apps/* |
| Show data table | Datatable component | `libs/shared/components` |
| Manage business data | Domain store | `libs/samba/domain/` |
| Layout page | Shared layout components | `libs/shared/components/layout/` |
| Style component | Material 3 + Tailwind | Shell app patterns |
| Share component | Shared component library | `libs/shared/components/` |
| Expose MFE component | WebComponents app | `apps/webcomponents/` |

---

**Keep this guide open when implementing features!**
