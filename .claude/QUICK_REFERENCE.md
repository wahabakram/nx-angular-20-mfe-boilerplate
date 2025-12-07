# Quick Reference: Building Components & Features

**Use this when implementing features to avoid common mistakes**

---

## 🚨 STOP! Before Writing ANY Code

### ⚠️ MANDATORY Pre-Implementation Checklist

**ALWAYS complete these steps BEFORE starting implementation:**

#### 1️⃣ Check Component Library (libs/shared/components/)
```bash
# We have 100+ components - USE THEM!
# See: libs/shared/components/docs/COMPONENT-MAPPING.md
```

**Common components you should NEVER recreate:**
- ❌ DON'T create: Table, Grid, Datatable → ✅ USE: `Datatable` from @ng-mf/components
- ❌ DON'T create: Dashboard, Widget Layout → ✅ USE: `Dashboard` from @ng-mf/components
- ❌ DON'T create: Form Builder → ✅ USE: `FormRenderer` from @ng-mf/components
- ❌ DON'T create: Modal, Dialog → ✅ USE: `Dialog` from @ng-mf/components
- ❌ DON'T create: Panel, Card → ✅ USE: `Panel` from @ng-mf/components
- ❌ DON'T create: Sidebar, Navigation → ✅ USE: `Sidebar`, `Navigation` from @ng-mf/components

#### 2️⃣ Reference Shell App (apps/shell/)
```bash
# Shell app has COMPLETE examples for everything
apps/shell/src/app/
├── dashboard/         # 8 dashboard examples - COPY THESE PATTERNS
├── widgets/_widgets/  # 60+ widget examples - USE AS TEMPLATES
├── auth/              # Complete auth flow - COPY THIS
└── applications/      # Feature examples - REFERENCE THESE
```

**Before implementing, search Shell for similar feature:**
- Need a dashboard? → Copy from `apps/shell/src/app/dashboard/`
- Need a widget? → Copy from `apps/shell/src/app/widgets/_widgets/`
- Need a form? → Copy from Shell app examples
- Need auth? → Copy from `apps/shell/src/app/auth/`

#### 3️⃣ Implementation Priority
```
1. ✅ Use @ng-mf/components (100+ ready-made components)
2. ✅ Copy Shell app pattern (proven implementations)
3. ✅ Check app-specific components
4. ⚠️ Create new component ONLY if none of above apply
```

---

## 🎯 5-Minute Implementation Checklist

- [ ] **SEARCHED** shared components (`libs/shared/components/docs/COMPONENT-MAPPING.md`)
- [ ] **VERIFIED** component doesn't already exist
- [ ] **CHECKED** Shell app for similar implementation
- [ ] **COPIED** pattern from Shell app (if applicable)
- [ ] **USED** existing components from @ng-mf/components
- [ ] **APPLIED** Shell app styling patterns
- [ ] **INJECTED** domain stores for business logic
- [ ] **CREATED** standalone component with proper imports
- [ ] **USED** Signals for state management
- [ ] **NAMED** file correctly (check app conventions)

---

## 🏗️ Component Template

```typescript
// Angular 20 Component Template with Latest Patterns
import { Component, inject, signal, computed, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

// Shared components
import { Panel, Datatable, FormRenderer } from '@ng-mf/components';

// Domain stores (if applicable)
import { ProductStore } from '@samba/product-domain';

interface Item {
  id: string;
  name: string;
}

@Component({
  selector: 'app-my-feature',
  imports: [
    // Angular 20: No need for CommonModule, use specific imports
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatIcon,
    Panel,
    Datatable,
    FormRenderer,
  ],
  templateUrl: './my-feature.html',
  styleUrl: './my-feature.scss',
  host: { class: 'block w-full' },
})
export class MyFeature { // Angular 20: NO Component suffix - intent-first naming
  // 1. Inject dependencies (Angular 20 style)
  private productStore = inject(ProductStore); // Domain-driven: Store suffix for state
  private router = inject(Router);

  // 2. Input signals (Angular 20 - no @Input decorator)
  initialData = input<any>();  // Optional input
  productId = input.required<string>();  // Required input
  
  // 3. Output signals (Angular 20 - no @Output decorator)
  saved = output<any>();
  cancelled = output<void>();

  // 4. Local state with signals
  items = signal<Item[]>([]);
  isLoading = signal(false);
  selectedId = signal<string | null>(null);

  // 5. Computed values (derived state)
  selectedItem = computed(() => {
    const id = this.selectedId();
    return this.items().find(i => i.id === id) || null;
  });
  
  hasItems = computed(() => this.items().length > 0);

  // 6. Constructor for initialization
  constructor() {
    // Load data on component initialization
    this.loadData();
  }

  // 7. Public methods
  loadData(): void {
    this.isLoading.set(true);
    
    // Example: Use store to load data
    this.store.loadProducts();
    
    // Update local state
    setTimeout(() => {
      this.items.set([
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
      ]);
      this.isLoading.set(false);
    }, 1000);
  }

  selectItem(id: string): void {
    this.selectedId.set(id);
  }

  handleSave(data: any): void {
    // Business logic here
    this.saved.emit(data);
  }
  
  handleCancel(): void {
    this.cancelled.emit();
    this.router.navigate(['/']);
  }

  // 8. Private helper methods
  private processData(): void {
    // Implementation
  }
}
```

---

## 📱 Dashboard Widget Template (Angular 20)

```typescript
import { Component, inject, signal, computed, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { Panel } from '@ng-mf/components';
import { SaleStore } from '@samba/sale-domain';

@Component({
  selector: 'app-total-sales-widget',
  imports: [CurrencyPipe, MatIcon, Panel],
  template: `
    <mf-panel class="h-full">
      <div class="flex flex-col items-center justify-center h-full gap-4 py-8">
        <mat-icon class="text-4xl text-primary">
          {{ icon() }}
        </mat-icon>
        <div class="text-center">
          <p class="text-sm text-muted-foreground">{{ label() }}</p>
          <p class="text-3xl font-bold text-primary">
            {{ value() | currency }}
          </p>
          @if (trend()) {
            <p class="text-sm" [class.text-green-600]="trend() === 'up'" [class.text-red-600]="trend() === 'down'">
              {{ trendText() }}
            </p>
          }
        </div>
      </div>
    </mf-panel>
  `,
  host: { class: 'block' },
})
export class TotalSalesWidget { // Angular 20: NO Component suffix - intent-first naming
  // Inject store
  private saleStore = inject(SaleStore);
  
  // Inputs with defaults (Angular 20)
  label = input<string>('Total Sales');
  icon = input<string>('shopping_cart');
  trend = input<'up' | 'down' | null>(null);

  // Computed value from store (reactive)
  value = computed(() => {
    return this.saleStore.sales().reduce((sum, sale) => sum + sale.total, 0);
  });
  
  // Computed trend text
  trendText = computed(() => {
    const trendValue = this.trend();
    if (trendValue === 'up') return '↑ Increasing';
    if (trendValue === 'down') return '↓ Decreasing';
    return '';
  });
}
```

---

## 📊 Data Table Pattern

```typescript
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Datatable, DatatableColumn } from '@ng-mf/components';
import { ProductStore } from '@samba/product-domain';

@Component({
  selector: 'app-products-table',
  standalone: true,
  imports: [CommonModule, Datatable],
  template: `
    <mf-datatable
      [columns]="columns"
      [data]="products()"
      [loading]="isLoading()"
      (rowClick)="onRowClick($event)" />
  `,
})
export class ProductsTable {
  private store = inject(ProductStore);

  products = this.store.products;
  isLoading = signal(false);

  columns: DatatableColumn[] = [
    { id: 'id', header: 'ID', cell: (row: any) => row.id },
    { id: 'name', header: 'Name', cell: (row: any) => row.name },
    { id: 'price', header: 'Price', cell: (row: any) => `$${row.price}` },
    { id: 'stock', header: 'Stock', cell: (row: any) => row.stockLevel },
  ];

  onRowClick(row: any): void {
    // Handle row click
  }
}
```

---

## 🎯 Dashboard Page Pattern

```typescript
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';
import { TotalSalesWidget } from './widgets/total-sales-widget';
import { RevenueWidget } from './widgets/revenue-widget';
import { SalesChartWidget } from './widgets/sales-chart-widget';

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    Dashboard,
    TotalSalesWidget,
    RevenueWidget,
    SalesChartWidget,
  ],
  template: `
    <mf-dashboard
      [configs]="configs()"
      [items]="items()"
      [editable]="true"
      (itemsChange)="onItemsChange($event)" />
  `,
})
export class SalesDashboard {
  configs = signal<WidgetConfig[]>([
    { name: 'total-sales', label: 'Total Sales', component: TotalSalesWidget },
    { name: 'revenue', label: 'Revenue', component: RevenueWidget },
    { name: 'sales-chart', label: 'Sales Chart', component: SalesChartWidget },
  ]);

  items = signal<WidgetItem[]>([
    { id: '1', name: 'total-sales', x: 0, y: 0, w: 3, h: 2 },
    { id: '2', name: 'revenue', x: 3, y: 0, w: 3, h: 2 },
    { id: '3', name: 'sales-chart', x: 0, y: 2, w: 6, h: 4 },
  ]);

  onItemsChange(items: WidgetItem[]): void {
    this.items.set(items);
    // Persist to storage if needed
  }
}
```

---

## 🔄 Feature with Domain Logic

```typescript
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { Panel, FormRenderer } from '@ng-mf/components';

// Domain imports
import { SaleStore, SaleService } from '@samba/sale-domain';
import { ProductStore } from '@samba/product-domain';

@Component({
  selector: 'app-create-sale',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButton,
    Panel,
    FormRenderer,
  ],
  templateUrl: './create-sale.html',
  styleUrl: './create-sale.scss',
})
export class CreateSale {
  // Domain services & stores
  private saleStore = inject(SaleStore);
  private saleService = inject(SaleService);
  private productStore = inject(ProductStore);
  private router = inject(Router);

  // Component state
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Access domain data via signals
  products = this.productStore.products;
  isCreating = this.saleStore.isCreating;

  // Form schema for FormRenderer
  formSchema = signal([
    { name: 'customer', label: 'Customer', type: 'text', required: true },
    { name: 'items', label: 'Items', type: 'array', required: true },
    { name: 'notes', label: 'Notes', type: 'textarea' },
  ]);

  onSubmit(formData: any): void {
    this.isLoading.set(true);
    this.saleService.create(formData).subscribe({
      next: (sale) => {
        this.saleStore.addSale(sale);
        this.router.navigate(['/sales', sale.id]);
      },
      error: (err) => {
        this.error.set(err.message);
        this.isLoading.set(false);
      },
    });
  }
}
```

---

## 🎨 Styling Template

```scss
// Use host binding for main container styling
:host {
  @apply block w-full;
}

// Use Tailwind utilities wherever possible
.card {
  @apply rounded-lg shadow-md p-4 bg-surface;
}

.card.active {
  @apply shadow-lg bg-primary-50 border border-primary;
}

.header {
  @apply flex items-center justify-between gap-4 mb-4 pb-4 border-b;
}

// Use CSS variables for colors
.accent {
  color: var(--md-sys-color-primary);
}

// Mobile-first responsive
.grid {
  @apply grid grid-cols-1 gap-4;

  @media (min-width: 768px) {
    @apply grid-cols-2;
  }

  @media (min-width: 1024px) {
    @apply grid-cols-3;
  }
}
```

---

## ✅ Component Checklist

Before pushing code:

### Structure
- [ ] Component is standalone
- [ ] Proper imports (no unused)
- [ ] Host class for styling
- [ ] Correct file naming (no .component suffix)
- [ ] Template, styles in separate files

### Functionality
- [ ] Uses shared components
- [ ] Injects domain stores
- [ ] Signals for state
- [ ] Computed properties where applicable
- [ ] Proper lifecycle hooks

### UX/Design
- [ ] Responsive (mobile-first)
- [ ] Accessible (ARIA labels, semantic HTML)
- [ ] Loading states
- [ ] Error handling
- [ ] Follows Material Design 3

### Code Quality
- [ ] No console errors/warnings
- [ ] TypeScript strict mode
- [ ] Proper error handling
- [ ] Comments for complex logic
- [ ] Follows naming conventions

### Testing
- [ ] Unit tests added
- [ ] Happy path covered
- [ ] Edge cases tested
- [ ] No failing tests

---

## 📚 Reference Files to Check

- **Shell App Patterns**: `apps/shell/src/app/dashboard/analytics/`
- **Widget Examples**: `apps/shell/src/app/widgets/_widgets/`
- **Form Examples**: `apps/shell/src/app/components/`
- **Shared Components**: `libs/shared/components/src/lib/`
- **Domain Usage**: `apps/samba-web/src/app/`
- **Component API Reference**: `COMPONENT-MAPPING.md` (root)

---

## 🚀 Common Commands

```bash
# Generate new component
npx nx generate @nx/angular:component --project=<app>

# Test while developing
npx nx test <app> --watch

# Build and verify
npx nx build <app>

# Lint & format
npx nx lint <app>
npx nx format:write <app>
```

---

**Keep this accessible while coding!**
