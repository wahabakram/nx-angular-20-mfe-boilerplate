# Shell App - Reference Implementation

> **Context**: This is the **REFERENCE IMPLEMENTATION** for the entire workspace. All UI/UX patterns, widget implementations, and component usage should follow the patterns established in this app.

---

## 🎯 Purpose

The Shell app serves as:
1. **Complete Component Showcase** - Demonstrates all 100+ shared components
2. **Pattern Library** - Shows best practices for every common UI pattern
3. **Dashboard Examples** - Provides 8 complete dashboard implementations
4. **Widget Templates** - Contains 60+ production-ready widget examples
5. **MFE Orchestrator** - Manages navigation and module federation

**Rule:** When implementing ANY feature, check Shell first to see how it's done!

---

## 📁 Key Directories

### 1. **Dashboard Examples** (`src/app/dashboard/`)

**8 Complete Dashboard Implementations:**
```
src/app/dashboard/
├── analytics/          ✅ Analytics dashboard with charts & metrics
├── basic/             ✅ Simple dashboard layout
├── dynamic/           ✅ Dynamic widget loading
├── ecommerce/         ✅ E-commerce metrics & sales data
├── explore/           ✅ Data exploration UI
├── finance/           ✅ Financial dashboard
├── getting-started/   ✅ Onboarding dashboard
└── sales/             ✅ Sales performance metrics
```

**How to use:**
- Need analytics dashboard? → Copy `analytics/` pattern
- Need simple metrics? → Copy `basic/` pattern
- Need dynamic widgets? → Copy `dynamic/` pattern

---

### 2. **Widget Library** (`src/app/widgets/_widgets/`)

**60+ Production-Ready Widgets:**
```
src/app/widgets/_widgets/
├── analytics/         ✅ Analytics-specific widgets
├── common/           ✅ Common reusable widgets
├── crypto/           ✅ Cryptocurrency widgets
├── finance/          ✅ Financial widgets
├── general/          ✅ General-purpose widgets
└── sales/            ✅ Sales & revenue widgets
```

**Individual Widget Examples:**
- Metric cards: `total-sales-widget`, `revenue-widget`, `profit-widget`
- Chart widgets: `sales-chart-widget`, `revenue-trend-widget`
- List widgets: `top-products-widget`, `recent-orders-widget`
- Progress widgets: `goal-progress-widget`, `completion-widget`

**How to use:**
1. Find similar widget in `_widgets/`
2. Copy the pattern
3. Adapt to your data model
4. Use with Dashboard component

---

### 3. **Authentication Flow** (`src/app/auth/`)

**Complete Auth Implementation:**
```
src/app/auth/
├── sign-in/          ✅ Login page
├── sign-up/          ✅ Registration page
├── forgot-password/  ✅ Password reset
└── verify-email/     ✅ Email verification
```

**How to use:**
- Need auth screens? → Copy these patterns exactly
- Includes form validation, error handling, loading states

---

### 4. **Application Examples** (`src/app/applications/`)

**Real-World Feature Implementations:**
```
src/app/applications/
├── calendar/         ✅ Full calendar app
├── chat/            ✅ Real-time chat
├── email/           ✅ Email client
├── file-manager/    ✅ File browser
├── kanban/          ✅ Task board
└── notes/           ✅ Note-taking app
```

**How to use:**
- Need calendar? → Copy `calendar/` implementation
- Need chat? → Copy `chat/` implementation
- These are production-ready, feature-complete examples

---

## 🎨 When to Use Shell as Reference

### ✅ **ALWAYS Check Shell For:**

| Scenario | Location in Shell | What to Copy |
|----------|-------------------|--------------|
| **Creating a dashboard** | `src/app/dashboard/` | Layout, widget grid, state management |
| **Creating a widget** | `src/app/widgets/_widgets/` | Widget structure, data binding, styling |
| **Creating a form** | `src/app/auth/`, applications | Form validation, error handling, UX |
| **Creating a list** | `src/app/applications/` | Data tables, filtering, pagination |
| **Creating a chart** | Widget examples | ECharts integration, responsive charts |
| **Creating a layout** | `src/app/_partials/` | Header, sidebar, page wrapper |
| **Styling decisions** | Any component | Tailwind usage, color schemes, spacing |
| **State management** | Any feature | Signal-based state, computed values |
| **Navigation** | `src/app/` | Routing, lazy loading, guards |

---

## 🏗️ Architecture Patterns in Shell

### 1. **Widget-Based Dashboards** (MANDATORY Pattern)

```typescript
// Shell Pattern: src/app/dashboard/analytics/analytics.ts
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';

export class Analytics {
  configs = signal<WidgetConfig[]>([
    {
      id: 'total-sales',
      component: () => import('./widgets/total-sales-widget').then(m => m.TotalSalesWidget),
      title: 'Total Sales',
      description: 'Overall sales performance'
    }
  ]);

  items = signal<WidgetItem[]>([
    { id: 'total-sales', x: 0, y: 0, w: 3, h: 2 }
  ]);
}
```

**Template:**
```html
<mf-dashboard [configs]="configs()" [items]="items()" />
```

---

### 2. **Individual Widgets** (NOT Grouped Cards)

```typescript
// Shell Pattern: Individual metric widget
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-total-sales-widget',
  template: `
    <div class="widget-card">
      <h3>{{ title() }}</h3>
      <p class="metric">{{ value() | currency }}</p>
      <span class="change" [class.positive]="change() > 0">
        {{ change() }}%
      </span>
    </div>
  `
})
export class TotalSalesWidget {
  title = input<string>('Total Sales');
  value = input<number>(0);
  change = input<number>(0);
}
```

---

### 3. **Smart vs Presentational Components**

**Smart (Container):**
```typescript
// Handles data fetching, state management
export class ProductListContainer {
  private productStore = inject(ProductStore);
  products = this.productStore.products;
  loading = this.productStore.loading;
}
```

**Presentational:**
```typescript
// Only receives data, emits events
export class ProductList {
  products = input.required<Product[]>();
  productSelected = output<Product>();
}
```

---

## 🎯 Implementation Workflow

### When Creating New Features in SAMBA/Invoicely:

**Step 1: Search Shell**
```bash
# Find similar feature
cd apps/shell
grep -r "similar-pattern" src/
```

**Step 2: Copy Pattern**
```bash
# Copy the component/widget structure
# Adapt data models to your domain
```

**Step 3: Use Shared Components**
```typescript
// Shell shows how to use shared components
import { Datatable, Dashboard, Panel } from '@ng-mf/components';
```

**Step 4: Follow Styling**
- Use same Tailwind classes as Shell
- Follow same color schemes
- Maintain consistent spacing

---

## 🚫 What NOT to Do

❌ **Don't create custom implementations when Shell has examples**
❌ **Don't deviate from Shell's styling patterns**
❌ **Don't reinvent widgets - copy from Shell's _widgets/**
❌ **Don't use different state management patterns**
❌ **Don't ignore Shell's component usage examples**

---

## ✅ What TO Do

✅ **Copy Shell patterns exactly**
✅ **Use Shell widgets as templates**
✅ **Follow Shell's Tailwind usage**
✅ **Reference Shell for ALL UI decisions**
✅ **Maintain consistency with Shell's UX**

---

## 📚 Related Documentation

- **Main Guide:** [Root CLAUDE.md](../../CLAUDE.md)
- **Senior Engineer Guide:** [.claude/SENIOR_ENGINEER.md](../../.claude/SENIOR_ENGINEER.md)
- **Angular 20 Guide:** [.claude/ANGULAR_20_GUIDE.md](../../.claude/ANGULAR_20_GUIDE.md)
- **Styling Guide:** [.claude/STYLING_GUIDE.md](../../.claude/STYLING_GUIDE.md)
- **Component Library:** [libs/shared/components/](../../libs/shared/components/)

---

## 🎓 Quick Examples

### Example 1: Creating a Dashboard
```typescript
// 1. Check Shell: apps/shell/src/app/dashboard/analytics/
// 2. Copy the pattern
// 3. Replace with your widgets
// 4. Use Dashboard component from @ng-mf/components
```

### Example 2: Creating a Widget
```typescript
// 1. Check Shell: apps/shell/src/app/widgets/_widgets/analytics/
// 2. Find similar widget
// 3. Copy structure
// 4. Replace data binding with your domain model
```

### Example 3: Creating a Form
```typescript
// 1. Check Shell: apps/shell/src/app/auth/sign-in/
// 2. Copy form validation pattern
// 3. Copy error handling
// 4. Copy UX patterns (loading, success, error states)
```

---

**Remember:** Shell is your SOURCE OF TRUTH for all UI/UX implementation! 🎯
