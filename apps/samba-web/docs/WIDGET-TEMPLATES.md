# SAMBA Widget Templates

**Purpose:** Standard widget templates for consistent implementation across SAMBA-web

**Last Updated:** December 7, 2025

---

## 📋 Widget Types

SAMBA-web uses **4 main widget types**:

1. **Chart Widgets** - Data visualization with charts (Shell pattern)
2. **Metric Widgets** - KPI cards with icons and actions (SAMBA custom)
3. **Table Widgets** - Data tables/lists (SAMBA custom)
4. **Utility Widgets** - Headings, quick actions, etc. (SAMBA custom)

---

## 1️⃣ Chart Widget Template

**Use for:** Bar charts, line charts, pie charts, area charts, etc.

### Pattern (MUST Follow Shell App Standard)

```html
<!-- Chart Widget Template -->
<div class="p-5 flex items-center justify-between">
  <h3 class="tracking-tight text-sm font-semibold">Chart Title</h3>
  <!-- Optional: Add filter/action buttons here -->
</div>
<div class="px-5 pb-5">
  <div #chartContainer class="chart-container h-[300px]"></div>
</div>
```

### TypeScript

```typescript
import { Component, ElementRef, ViewChild, AfterViewInit, signal } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'app-your-chart-widget',
  standalone: true,
  templateUrl: './your-chart-widget.html',
  styleUrl: './your-chart-widget.scss'
})
export class YourChartWidget implements AfterViewInit {
  @ViewChild('chartContainer', { static: false }) chartContainer!: ElementRef;
  private chart: echarts.ECharts | null = null;

  ngAfterViewInit() {
    this.initChart();
  }

  private initChart() {
    if (!this.chartContainer) return;
    
    this.chart = echarts.init(this.chartContainer.nativeElement);
    
    const option = {
      // Your chart configuration
      xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      yAxis: { type: 'value' },
      series: [{ data: [120, 200, 150, 80, 70], type: 'bar' }]
    };
    
    this.chart.setOption(option);
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
}
```

### Examples

- ✅ `daily-sales-trend-widget`
- ✅ `inventory-by-category-widget`
- ✅ `sales-by-payment-widget`
- ✅ `stock-movement-widget`
- ✅ `top-products-widget`

---

## 2️⃣ Metric Widget Template

**Use for:** KPI cards, statistics, metrics with values

### Pattern (SAMBA Custom - With Icon + Action)

```html
<!-- Metric Widget Template -->
<div class="relative overflow-hidden group h-full">
  <div class="flex gap-5 p-6">
    <!-- Icon -->
    <div class="rounded-lg bg-primary size-12 flex-none flex items-center justify-center text-white">
      <mat-icon>icon_name</mat-icon>
    </div>
    
    <!-- Content -->
    <div>
      <div class="truncate text-sm font-medium text-neutral-500">Metric Label</div>
      <div class="flex items-center gap-2">
        <div class="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
          {{ value() }}
        </div>
        <!-- Optional: Trend indicator -->
        <div class="flex items-baseline text-sm gap-1 font-semibold text-green-600 dark:text-green-400">
          <mat-icon class="!text-lg !w-4 !h-5">trending_up</mat-icon>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Optional: Action button (visible on hover) -->
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

### TypeScript

```typescript
import { Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'app-your-metric-widget',
  standalone: true,
  imports: [MatIcon, MatTooltip, MatRipple],
  templateUrl: './your-metric-widget.html',
  styleUrl: './your-metric-widget.scss'
})
export class YourMetricWidget {
  // Inject your store/service
  private yourStore = inject(YourStore);
  
  // Expose data as signals
  value = this.yourStore.yourValue;
  
  // Optional: Click handler for action button
  onActionClick() {
    // Navigate or perform action
  }
}
```

### Icon Colors

```typescript
// Use semantic colors
bg-primary      // Blue - General metrics
bg-green-500    // Green - Revenue, positive metrics
bg-red-500      // Red - Alerts, critical items
bg-blue-500     // Blue - Products, inventory
bg-purple-500   // Purple - Users, accounts
bg-orange-500   // Orange - Warnings, pending items
```

### Examples

- ✅ `total-sales-widget`
- ✅ `revenue-widget`
- ✅ `total-products-widget`
- ✅ `total-profit-widget`
- ✅ `average-order-value-widget`
- ✅ `low-stock-count-widget`
- ✅ `total-inventory-value-widget`
- ✅ `out-of-stock-widget`

---

## 3️⃣ Table Widget Template

**Use for:** Lists of data with multiple columns

### Pattern (SAMBA Custom)

```html
<!-- Table Widget Template -->
<div class="h-full flex flex-col">
  <!-- Header -->
  <div class="p-5 flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
    <h3 class="tracking-tight text-sm font-semibold">Table Title</h3>
    <button mat-button class="text-primary">
      <mat-icon>arrow_forward</mat-icon>
      View All
    </button>
  </div>
  
  <!-- Table Content -->
  <div class="flex-1 overflow-auto">
    <table class="w-full">
      <thead class="bg-neutral-50 dark:bg-neutral-800 sticky top-0">
        <tr>
          <th class="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider p-3">
            Column 1
          </th>
          <th class="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider p-3">
            Column 2
          </th>
          <th class="text-right text-xs font-medium text-neutral-500 uppercase tracking-wider p-3">
            Column 3
          </th>
        </tr>
      </thead>
      <tbody class="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
        @for (item of items(); track item.id) {
          <tr class="hover:bg-neutral-50 dark:hover:bg-neutral-800">
            <td class="p-3 text-sm text-neutral-900 dark:text-neutral-100">
              {{ item.column1 }}
            </td>
            <td class="p-3 text-sm text-neutral-600 dark:text-neutral-400">
              {{ item.column2 }}
            </td>
            <td class="p-3 text-sm text-right text-neutral-900 dark:text-neutral-100">
              {{ item.column3 }}
            </td>
          </tr>
        }
      </tbody>
    </table>
  </div>
  
  <!-- Optional: Footer -->
  <div class="p-3 border-t border-neutral-200 dark:border-neutral-700 text-xs text-neutral-500">
    Showing {{ items().length }} items
  </div>
</div>
```

### TypeScript

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-your-table-widget',
  standalone: true,
  imports: [MatButton, MatIcon],
  templateUrl: './your-table-widget.html',
  styleUrl: './your-table-widget.scss'
})
export class YourTableWidget implements OnInit {
  private yourService = inject(YourService);
  
  items = signal<YourType[]>([]);
  
  ngOnInit() {
    this.loadData();
  }
  
  loadData() {
    this.yourService.getData().subscribe(data => {
      this.items.set(data);
    });
  }
}
```

### Examples

- ✅ `recent-sales-widget`
- ✅ `low-stock-widget`

---

## 4️⃣ Utility Widget Templates

### A. Heading Widget

**Use for:** Section headers in dashboards

```html
<h2 class="font-bold text-lg">{{ widget().title }}</h2>
```

```typescript
@Component({
  selector: 'app-heading-widget',
  standalone: true,
  templateUrl: './heading-widget.html'
})
export class HeadingWidget {
  @Input() widget = input.required<{ title: string }>();
}
```

### B. Quick Action Widget

**Use for:** Action cards with navigation

```html
<div class="relative h-full group p-5 flex items-center gap-5 
            hover:bg-surface-container cursor-pointer transition-colors" 
     matRipple 
     (click)="navigate()">
  <!-- Icon -->
  <div class="rounded-lg bg-primary/10 dark:bg-primary/20 size-12 flex-none 
              flex items-center justify-center">
    <mat-icon class="text-primary">{{ widget().iconName }}</mat-icon>
  </div>
  
  <!-- Content -->
  <div class="flex-1">
    <div class="font-semibold text-neutral-900 dark:text-neutral-100">
      {{ widget().title }}
    </div>
    <div class="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
      {{ widget().description }}
    </div>
  </div>
  
  <!-- Arrow -->
  <mat-icon class="text-neutral-400 group-hover:text-primary transition-colors">
    arrow_forward
  </mat-icon>
</div>
```

```typescript
@Component({
  selector: 'app-quick-action-widget',
  standalone: true,
  imports: [MatIcon, MatRipple],
  templateUrl: './quick-action-widget.html'
})
export class QuickActionWidget {
  private router = inject(Router);
  
  @Input() widget = input.required<{
    iconName: string;
    title: string;
    description: string;
    route: string;
  }>();
  
  navigate() {
    this.router.navigate([this.widget().route]);
  }
}
```

---

## 🎨 Styling Guidelines

### Common Classes

```scss
// Widget container (provided by Dashboard component)
// No need to add these - Dashboard handles it

// Header section
.p-5                              // Padding for headers
.tracking-tight                   // Typography
.text-sm font-semibold           // Standard header size

// Content section
.px-5 pb-5                       // Content padding
.p-6                             // Metric widget padding

// Dark mode
.dark\:text-neutral-100          // Main text
.dark\:text-neutral-500          // Secondary text
.dark\:bg-neutral-800            // Backgrounds
```

### Color Palette

```scss
// Semantic colors (use Tailwind classes)
primary          // Blue - main brand color
green-500/600    // Success, positive metrics
red-500/600      // Error, critical alerts
orange-500       // Warning
purple-500       // Special features
neutral-*        // Grays for text and backgrounds
```

---

## 📋 Widget Checklist

When creating a new widget:

- [ ] Identify widget type (Chart, Metric, Table, or Utility)
- [ ] Copy appropriate template from this document
- [ ] Use correct imports (standalone components only)
- [ ] Apply consistent styling (p-5, tracking-tight, etc.)
- [ ] Include dark mode classes (dark:text-*, dark:bg-*)
- [ ] Use signals for reactive state
- [ ] Add TypeScript types for all data
- [ ] Test with Dashboard component
- [ ] Verify responsive behavior
- [ ] Add JSDoc comments

---

## 🎨 Dashboard Component Usage

### Using the Dashboard Component

**IMPORTANT:** Always use the `plain` attribute for consistent styling.

```html
<!-- ✅ CORRECT - With plain attribute (no border, just shadow) -->
<mf-dashboard [configs]="configs()" [items]="items()" plain />

<!-- ❌ WRONG - Without plain (adds border) -->
<mf-dashboard [configs]="configs()" [items]="items()" />
```

### What `plain` Does

- **Without `plain`:** Widgets have `border: 1px solid` + `border-radius`
- **With `plain`:** Widgets have NO border (shadow comes from widget itself)

**All SAMBA pages use `plain`:**
- ✅ Admin Dashboard
- ✅ Manager Dashboard
- ✅ Inventory Report
- ✅ Sales Report

### Example Usage

```typescript
import { Component, signal } from '@angular/core';
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';

@Component({
  selector: 'app-my-page',
  standalone: true,
  imports: [Dashboard],
  template: `
    <mf-dashboard [configs]="configs()" [items]="items()" plain />
  `
})
export class MyPage {
  configs = signal<WidgetConfig[]>([
    { type: 'sales', component: () => import('./widgets/sales-widget') }
  ]);
  
  items = signal<WidgetItem[]>([
    { id: 'sales-1', type: 'sales', columns: 4, height: '200px' }
  ]);
}
```

---

## ❌ Common Mistakes to Avoid

### DON'T Do This:

```html
<!-- ❌ OLD PATTERN - Don't use -->
<header class="flex justify-between items-center mb-4">
  <div class="font-semibold">Widget Title</div>
</header>

<!-- ❌ WRONG - Missing padding -->
<div class="font-semibold">Title</div>
<div #chartContainer></div>

<!-- ❌ WRONG - Inconsistent typography -->
<div class="text-lg font-bold">Title</div>

<!-- ❌ WRONG - No dark mode support -->
<div class="text-gray-900">{{ value }}</div>
```

### DO This Instead:

```html
<!-- ✅ CORRECT - Shell pattern -->
<div class="p-5 flex items-center justify-between">
  <h3 class="tracking-tight text-sm font-semibold">Widget Title</h3>
</div>
<div class="px-5 pb-5">
  <div #chartContainer class="h-[300px]"></div>
</div>

<!-- ✅ CORRECT - With dark mode -->
<div class="text-neutral-900 dark:text-neutral-100">{{ value }}</div>
```

---

## 🔗 Related Documentation

- **Shell App Widgets:** `apps/shell/src/app/widgets/_widgets/` - Reference implementations
- **SAMBA AGENTS.md:** Widget styling mandatory patterns
- **Component Library:** `libs/shared/components/` - Shared UI components

---

## 📚 Examples Reference

### Chart Widgets (Shell Pattern)
```bash
apps/samba-web/src/app/widgets/_widgets/
├── daily-sales-trend-widget/        ⭐ Good example
├── inventory-by-category-widget/    ⭐ Good example
└── stock-movement-widget/           ⭐ Good example
```

### Metric Widgets (SAMBA Custom)
```bash
apps/samba-web/src/app/widgets/_widgets/
├── total-sales-widget/              ⭐ Good example
├── revenue-widget/                  ⭐ Good example
└── total-products-widget/           ⭐ Good example
```

### Table Widgets (SAMBA Custom)
```bash
apps/samba-web/src/app/widgets/_widgets/
├── recent-sales-widget/             ⭐ Good example
└── low-stock-widget/                ⭐ Good example
```

---

## 🎯 Quick Start

**To create a new widget:**

1. **Choose template** - Pick the right type from this document
2. **Copy template** - Copy HTML and TypeScript code
3. **Customize** - Replace placeholders with your data
4. **Test** - Add to dashboard and verify
5. **Review** - Check against checklist above

**Remember:** Always reference Shell app for chart widgets, and existing SAMBA widgets for metric/table widgets!

---

**Last Updated:** December 7, 2025  
**Maintainer:** Development Team
