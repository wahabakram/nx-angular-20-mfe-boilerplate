# SAMBA ERP - Claude Development Guide

> **Context**: You are working on **SAMBA ERP**, a sophisticated business automation platform. Act as a **senior software engineer** who understands the existing architecture, not as a freelancer who needs repeated instructions. This document provides the complete context you need.

---

## 🎯 Project Philosophy

**"Don't Repeat Yourself" (DRY)** - This workspace is designed for maximum reusability:
1. **Shell app** (`apps/shell/`) = Reference implementation & component patterns
2. **Shared libs** (`libs/shared/components/`) = 70+ pre-built UI components
3. **Domain libs** (`libs/samba/domain/`) = Business logic & data models
4. **Widget architecture** = Modular, lazy-loaded UI components

**Your role**: Leverage existing code. Create new code only when necessary.

---

## 🔍 Component Discovery Workflow (MANDATORY)

**Before writing ANY code**, follow this exact discovery process:

### Step 1: Check SAMBA Web Components First
```bash
# Check existing widgets
apps/samba-web/src/app/widgets/_widgets/

# Check existing cells (data display components)
apps/samba-web/src/app/_cells/

# Check existing partials (layout components)
apps/samba-web/src/app/_partials/
```

**Key Components Already Available:**
- `Page` - Page wrapper with title/description
- `Header` - App header with navigation
- `Sidebar` - App sidebar navigation
- `MainLayout` - Complete layout wrapper
- **Individual metric widgets**: total-sales-widget, revenue-widget, total-products-widget, etc.
- **Chart widgets**: Use echarts directly, follow shell app patterns
- **Table widgets**: Use Datatable from @ng-mf/components

### Step 2: Check Shell App (Reference Implementation)
```bash
# Shell app is the DEFINITIVE reference
apps/shell/src/app/
```

**Shell App Structure** (8 Complete Dashboard Examples):
- `dashboard/analytics/` - Analytics dashboard with charts
- `dashboard/basic/` - Basic dashboard layout
- `dashboard/dynamic/` - Dynamic widget loading
- `dashboard/ecommerce/` - E-commerce metrics
- `dashboard/explore/` - Exploration/discovery UI
- `dashboard/finance/` - Financial dashboard
- `dashboard/getting-started/` - Onboarding dashboard
- `auth/` - Complete auth flow (signin, signup, forgot-password, etc.)
- `widgets/_widgets/` - 60+ widget examples

**When to use Shell App:**
- Creating new dashboard pages → Copy pattern from shell dashboards
- Creating auth pages → Use shell/auth/ as template
- Creating widgets → Examine shell/widgets/_widgets/
- Styling patterns → Shell app sets the standard

### Step 3: Check Shared Component Library
```bash
libs/shared/components/src/lib/
```

**Available Components (70+)**:

**Layout & Navigation:**
- `Dashboard` - Widget-based dashboard system ⭐
- `Layout` - Page layout system
- `Sidebar`, `Navigation`, `RailNav`
- `Panel` - Collapsible panels
- `Drawer` - Side drawer
- `Breadcrumbs`

**Data Display:**
- `Datatable` - Feature-rich data table ⭐
- `DataView` - Grid/List view switcher
- `Carousel` - Image/content carousel
- `Timeline` - Event timeline
- `Avatar` - User avatars
- `StatCard` - Stat display cards (DEPRECATED - use individual widgets instead)

**Forms:**
- `FormRenderer` - Dynamic form builder
- `CountrySelect`, `CurrencySelect`, `TimezoneSelect`
- `PhoneInput`, `PinInput`, `NumberInput`
- `PasswordStrength` - Password validation
- `SignaturePad` - Signature capture
- `DateFormatSelect`
- `InlineTextEdit` - Inline editing
- `RadioCard`, `Segmented` - Custom inputs

**Feedback:**
- `Alert` - Alert messages
- `Confirm` - Confirmation dialogs
- `BlockLoader`, `BlockState` - Loading states
- `ActionRequired` - Action prompts
- `Announcement` - Announcements
- `CookiePopup` - Cookie consent
- `Suggestions` - Suggestion system

**Visualizations:**
- `Charts` - Chart components (use echarts directly for custom charts)
- `MicroChart` - Small inline charts
- `Gauge` - Gauge charts
- `Stepper` - Step indicators

**Media:**
- `ImageViewer` - Image viewing
- `ImageResizer` - Image manipulation
- `Upload` - File upload

**Editors:**
- `TextEditor` - Rich text editor
- `CommentEditor` - Comment input
- `MarkdownEditor` - Markdown editing
- `CodeHighlighter` - Code syntax highlighting
- `ContentEditor` - Full content editor

**UI Elements:**
- `Logo` - App logo component
- `Icon` - Icon system
- `ColorPicker`, `ColorScheme`, `BrandColors`
- `Divider`, `HorizontalDivider`
- `Overlay`, `CardOverlay`
- `ContentFade`, `Expand`
- `Marquee`, `Masonry`
- `Popover` - Popovers
- `Notifications` - Toast notifications
- `OverlayScrollbar` - Custom scrollbars
- `FilterBuilder` - Query builder
- `TabPanel` - Tab panels
- `CommandBar` - Command palette
- `EmojiPicker` - Emoji selection
- `Selects` - Custom select components
- `SplashScreen` - Loading screen
- `PageLoadingBar` - Top loading bar

**Specialized:**
- `InvoiceBuilder` - Invoice creation
- `KanbanBoard` - Kanban board
- `Notes` - Note-taking
- `Incidents` - Incident tracker
- `CourseBuilder` - Course creation
- `ThumbnailMaker` - Thumbnail generation
- `ScrollSpy` - Scroll tracking
- `ResizableContainer` - Resizable panels

**Import Example:**
```typescript
import {
  Dashboard,
  Datatable,
  Panel,
  Logo,
  HorizontalDivider
} from '@ng-mf/components';
```

### Step 4: Angular Material (Standard Components)
```typescript
// Only use after checking above
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatRipple } from '@angular/material/core';
```

### Step 5: Last Resort - Create Custom Component
**Only if**:
- No existing component matches
- No shell app pattern exists
- No shared library component exists
- No Material component fits

**Then**: Follow shell app styling patterns exactly.

---

## 🏗️ Architecture Patterns

### Widget Architecture (MANDATORY for Dashboards/Reports)

**Concept**: Pages are composed of lazy-loaded, reusable widgets managed by the Dashboard component.

**When to use**:
- Dashboards
- Reports
- Analytics pages
- Any page with multiple data sections

**Structure**:
```
apps/samba-web/src/app/
├── features/
│   └── reports/
│       └── sales-report/
│           ├── sales-report.ts          # Page component
│           └── sales-report.html        # Uses <mf-dashboard>
└── widgets/
    └── _widgets/
        ├── total-sales-widget/          # Individual widgets
        ├── revenue-widget/
        ├── daily-sales-trend-widget/    # Chart widgets
        └── recent-sales-widget/         # Table widgets
```

**Page Component Pattern**:
```typescript
import { Component, signal } from '@angular/core';
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';
import { Page } from '../../../_partials/page/page';

@Component({
  selector: 'app-sales-report',
  imports: [Dashboard, Page],
  templateUrl: './sales-report.html',
  styleUrl: './sales-report.scss'
})
export class SalesReport {
  // Define widget configurations (types + lazy imports)
  configs = signal<WidgetConfig[]>([
    {
      type: 'total-sales-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/total-sales-widget/total-sales-widget').then(
          (c) => c.TotalSalesWidget
        ),
    },
    // ... more widgets
  ]);

  // Define widget layout (grid columns: 12-column system)
  items = signal<WidgetItem[]>([
    {
      id: 1,
      type: 'total-sales-widget',
      columns: 3,  // 25% width (3/12)
    },
    {
      id: 2,
      type: 'daily-sales-trend-widget',
      columns: 12,  // Full width (12/12)
      skeletonHeight: '350px',
    },
    // ... more items
  ]);
}
```

**Page Template Pattern**:
```html
<app-page>
  <ng-container pageTitle>Sales Report</ng-container>
  <ng-container pageDescription>Analyze sales performance and trends</ng-container>

  <mf-dashboard [configs]="configs()" [items]="items()" />
</app-page>
```

**Individual Widget Pattern** (Metric Card):
```typescript
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Dashboard, DASHBOARD, WidgetItem } from '@ng-mf/components';

@Component({
  selector: 'app-total-sales-widget',
  imports: [MatIcon, MatRipple, MatTooltip],
  templateUrl: './total-sales-widget.html',
  styleUrl: './total-sales-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class TotalSalesWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<WidgetItem>();

  // Widget data (use signals)
  totalSales = signal(156);

  ngOnInit() {
    // Mark widget as loaded
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }

    // TODO: Load real data from service
  }
}
```

**Widget Template Pattern**:
```html
<div class="relative overflow-hidden group h-full">
  <div class="flex gap-5 p-6">
    <div class="rounded-lg bg-blue-500 size-12 flex-none flex items-center justify-center text-white">
      <mat-icon>shopping_cart</mat-icon>
    </div>
    <div>
      <div class="truncate text-sm font-medium text-neutral-500">Total Sales</div>
      <div class="flex items-center gap-2">
        <div class="text-xl font-semibold text-neutral-800 dark:text-neutral-100">{{ totalSales() }}</div>
        <div class="flex items-baseline text-sm gap-1 font-semibold text-green-600 dark:text-green-400">
          <mat-icon class="!text-lg !w-4 !h-5">arrow_upward</mat-icon>
          <span class="sr-only">Increased by</span>12.5%
        </div>
      </div>
    </div>
  </div>
  <div class="absolute right-0 top-0 bottom-0">
    <button matRipple matTooltip="View details"
            class="cursor-pointer h-full hover:bg-surface-container-high
                 w-10 bg-surface-container flex
                 items-center justify-center invisible group-hover:visible">
      <mat-icon>arrow_right_alt</mat-icon>
    </button>
  </div>
</div>
```

**Chart Widget Pattern** (Using ECharts):
```typescript
import {
  Component, DestroyRef, ElementRef,
  computed, effect, inject, input,
  viewChild, OnInit, signal
} from '@angular/core';
import { init, use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import { Dashboard, DASHBOARD, WidgetItem } from '@ng-mf/components';

use([TooltipComponent, GridComponent, LineChart, CanvasRenderer]);

@Component({
  selector: 'app-daily-sales-trend-widget',
  imports: [],
  templateUrl: './daily-sales-trend-widget.html',
  styleUrl: './daily-sales-trend-widget.scss',
  host: { class: 'widget-container' }
})
export class DailySalesTrendWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });
  private readonly chartContainer = viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');
  private chart: any;
  private resizeObserver?: ResizeObserver;
  private readonly destroyer = inject(DestroyRef);

  widget = input<WidgetItem>();
  salesData = signal([/* chart data */]);

  private readonly chartOptions = computed<EChartsOption>(() => ({
    // ECharts configuration
  }));

  constructor() {
    effect(() => this.init());
    this.destroyer.onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.chart?.dispose();
    });
  }

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }

  private init() {
    const element = this.chartContainer().nativeElement;
    if (!this.chart) {
      this.chart = init(element);
      this.resizeObserver = new ResizeObserver(() => this.chart?.resize());
      this.resizeObserver.observe(element);
    }
    this.chart.setOption(this.chartOptions());
  }
}
```

**Widget Types:**
1. **Metric Widgets** - Single stat displays (columns: 3 for 4-per-row)
2. **Chart Widgets** - Visualizations (columns: 6 or 12)
3. **Table Widgets** - Data tables (columns: 12, use Datatable component)
4. **List Widgets** - Item lists (columns: 6 or 12)

**Grid System**: 12-column grid
- `columns: 3` = 25% width (4 widgets per row)
- `columns: 4` = 33% width (3 widgets per row)
- `columns: 6` = 50% width (2 widgets per row)
- `columns: 12` = 100% width (full row)

---

## 📐 Domain-Driven Architecture

### Domain Structure
```
libs/samba/domain/
├── user/           # User management
├── product/        # Product catalog
├── inventory/      # Stock management
├── sale/           # Sales transactions
├── customer/       # Customer management
├── branch/         # Multi-branch support
└── category/       # Product categories
```

### Domain Alignment Rules

**1. Always import from domain libs:**
```typescript
import { ProductStore, ProductService } from '@samba/product-domain';
import { SaleStore, SaleService } from '@samba/sale-domain';
import { UserStore, AuthService } from '@samba/user-domain';
```

**2. Use domain models:**
```typescript
// ✅ CORRECT
interface User {
  id: number;
  username: string;  // NOT email for login
  email: string;
  firstName: string;  // NOT name
  lastName: string;
  role: UserRole;
  branchId: number;
  isActive: boolean;
}

// ❌ WRONG
interface User {
  id: number;
  email: string;  // Wrong for login
  name: string;   // Use firstName + lastName
}
```

**3. Use domain stores (signals-based state):**
```typescript
export class SalesReport {
  private saleStore = inject(SaleStore);

  // Access reactive data
  todaySales = this.saleStore.todaySales;
  todayRevenue = this.saleStore.todayRevenue;
}
```

---

## 🎨 UI/UX Standards

### File Naming (Angular 20 Style)
```
✅ CORRECT:
- login.ts
- login.html
- login.scss
- export class Login

❌ WRONG:
- login.component.ts
- login.component.html
- login.css
- export class LoginComponent
```

### Styling Standards
- **ALWAYS `.scss`**, NEVER `.css`
- Use Tailwind utilities first
- Use Material Design tokens (primary, error, neutral-500, etc.)
- Add `mat-typography` class on root elements
- Responsive: Use `md:`, `lg:` prefixes

### Component Structure
```typescript
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Logo } from '@ng-mf/components';

@Component({
  selector: 'app-feature',
  imports: [MatButton, Logo],  // Standalone imports
  templateUrl: './feature.html',
  styleUrl: './feature.scss'    // Note: styleUrl not styleUrls
})
export class Feature {
  // Use signals for reactive state
  data = signal([]);
}
```

### Color Standards
**Metric widgets use consistent colors:**
- Blue (`bg-blue-500`): General metrics, primary data
- Green (`bg-green-500`): Revenue, money, positive growth
- Emerald (`bg-emerald-500`): Profit, success metrics
- Purple (`bg-purple-500`): Averages, calculated metrics
- Orange (`bg-orange-500`): Warnings, low stock
- Red (`bg-red-500`): Errors, critical alerts, out of stock

---

## 🚀 Development Workflow

### Creating a New Dashboard/Report Page

1. **Check shell app dashboards** (`apps/shell/src/app/dashboard/`)
2. **Create page component** using Page wrapper
3. **Identify widgets needed** - check existing widgets first
4. **Create new widgets** if needed (following shell app pattern)
5. **Configure Dashboard** with widget configs + items
6. **Use domain stores** for data

### Creating a New Widget

1. **Check existing widgets** in `apps/samba-web/src/app/widgets/_widgets/`
2. **Check shell app widgets** in `apps/shell/src/app/widgets/_widgets/`
3. **Create widget component** following shell app pattern
4. **Inject Dashboard context** for loading notification
5. **Use signals** for reactive state
6. **Connect to domain stores** for data

### Creating a New Form

1. **Check shell app auth pages** for form patterns
2. **Use Material form fields** exclusively
3. **Use ReactiveFormsModule**
4. **Use domain services** for submission
5. **Follow shell app validation patterns**

---

## ⚠️ Common Mistakes to Avoid

### ❌ Don't Do This:
1. Creating static pages with mat-cards instead of using Dashboard + widgets
2. Creating grouped metric widgets (e.g., sales-metrics-widget with 4 metrics)
3. Using `.css` files instead of `.scss`
4. Creating custom components when shared libs have them
5. Ignoring shell app patterns
6. Using old/deprecated components (StatCard, ChartWidget - use custom widgets instead)
7. Not checking existing code before creating new components

### ✅ Do This:
1. Use Dashboard component with individual metric widgets
2. Create separate widgets for each metric (total-sales-widget, revenue-widget, etc.)
3. Always use `.scss` files
4. Check libs/shared/components FIRST
5. Reference shell app for all new patterns
6. Create custom HTML with Tailwind + Material icons
7. Always search codebase before creating anything new

---

## 📋 Pre-Implementation Checklist

Before writing ANY code, verify:

- [ ] Checked `apps/samba-web/src/app/` for existing components
- [ ] Checked `apps/shell/src/app/` for reference patterns
- [ ] Checked `libs/shared/components` for reusable components
- [ ] Checked domain libs for data models and services
- [ ] Will use `.scss` not `.css`
- [ ] Will follow Angular 20 naming (no .component suffix)
- [ ] Will use Dashboard + individual widgets for dashboards/reports
- [ ] Will use domain stores for data access
- [ ] Will follow shell app's UI patterns exactly

---

## 🎓 Key Principles

1. **Reuse Over Reinvent**: This workspace has extensive existing code. Use it.
2. **Shell App is Law**: When in doubt, check shell app. It's the reference implementation.
3. **Widgets for Everything**: Dashboards and reports use Dashboard + widget architecture.
4. **Domain-Driven**: Business logic lives in domain libs, not components.
5. **Material + Tailwind**: Use Material components styled with Tailwind utilities.
6. **Signals Everywhere**: Use signals for reactive state management.
7. **Type Safety**: Use TypeScript strictly, align with domain models.

---

## 📚 Quick Reference

### Dashboard Implementation
```typescript
// Page component
configs = signal<WidgetConfig[]>([/* widget configs */]);
items = signal<WidgetItem[]>([/* widget layout */]);

// Template
<mf-dashboard [configs]="configs()" [items]="items()" />
```

### Widget Implementation
```typescript
// Inject dashboard context
private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

// Mark as loaded in ngOnInit
this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
```

### Data Access
```typescript
// Inject domain store
private saleStore = inject(SaleStore);

// Access reactive data
todaySales = this.saleStore.todaySales;
```

### Styling
```html
<!-- Use Tailwind + Material icons -->
<div class="rounded-lg bg-blue-500 size-12">
  <mat-icon>shopping_cart</mat-icon>
</div>
```

---

**Remember**: You're a senior engineer working on an established codebase. Understand the architecture, leverage existing code, and maintain consistency. Don't reinvent wheels—use what's already built.
