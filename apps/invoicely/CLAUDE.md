# Invoicely - Invoice & Payment Management

> **Context**: Invoicely is an invoice and payment management application built with Module Federation. This is a remote app loaded by the Shell host.

---

## 🎯 Purpose

Invoicely provides:
1. **Invoice Creation & Management** - Create, edit, send invoices
2. **Client Management** - Track customers and their invoices
3. **Payment Tracking** - Record and track payments
4. **Reporting** - Generate financial reports
5. **Template System** - Customizable invoice templates

---

## 🏗️ Architecture

### Module Federation Setup

**Remote App Configuration:**
```typescript
// module-federation.config.ts
module.exports = {
  name: 'invoicely',
  exposes: {
    './Module': './src/app/remote-entry/entry.routes.ts'
  }
};
```

**Loaded by Shell:**
- Shell loads Invoicely as a remote module
- Lazy-loaded on navigation
- Shared dependencies via Module Federation

---

## 📁 Key Features

### 1. **Invoice Management**
- Create/edit invoices
- Invoice templates
- PDF generation
- Email sending
- Status tracking (draft, sent, paid, overdue)

### 2. **Client Management**
- Client profiles
- Contact information
- Invoice history
- Payment records

### 3. **Payment Tracking**
- Record payments
- Payment methods
- Partial payments
- Payment history

### 4. **Reporting**
- Revenue reports
- Outstanding invoices
- Client summaries
- Tax reports

---

## 🎨 Implementation Patterns

### Always Reference Shell App

Before implementing ANY feature in Invoicely:

1. **Check Shell App** (`apps/shell/`) for similar patterns
2. **Use Shared Components** from `@ng-mf/components`
3. **Follow Angular 20 naming** (see `.claude/ANGULAR_20_GUIDE.md`)
4. **Follow styling guide** (see `.claude/STYLING_GUIDE.md`)

### Widget-Based Dashboards

**For Invoicely dashboard:**
```typescript
// Use Dashboard component from @ng-mf/components
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';

// Follow Shell pattern for widget implementation
configs = signal<WidgetConfig[]>([
  {
    id: 'total-revenue',
    component: () => import('./widgets/total-revenue-widget').then(m => m.TotalRevenueWidget)
  }
]);
```

### Forms

**Use existing patterns:**
```typescript
// Check Shell: apps/shell/src/app/auth/ for form patterns
// Follow reactive forms approach
// Include proper validation and error handling
```

---

## 🔧 Technology Stack

| Technology | Usage |
|------------|-------|
| **Angular 20** | Framework |
| **Signals** | State management |
| **Tailwind CSS 4** | Styling |
| **@ng-mf/components** | UI components |
| **Module Federation** | Microfrontend architecture |
| **RxJS** | Reactive programming |

---

## 📚 Documentation References

### Core Guides
- **Main Guide:** [Root CLAUDE.md](../../CLAUDE.md)
- **Senior Engineer:** [.claude/SENIOR_ENGINEER.md](../../.claude/SENIOR_ENGINEER.md)
- **Angular 20:** [.claude/ANGULAR_20_GUIDE.md](../../.claude/ANGULAR_20_GUIDE.md)
- **Styling:** [.claude/STYLING_GUIDE.md](../../.claude/STYLING_GUIDE.md)

### Reference Implementations
- **Shell App:** [apps/shell/CLAUDE.md](../shell/CLAUDE.md) - UI/UX patterns
- **Component Library:** [libs/shared/components/](../../libs/shared/components/)

---

## ✅ Development Workflow

### Before Creating ANY Feature:

1. **Check Shell app** for similar implementation
2. **Search shared components** (`@ng-mf/components`)
3. **Review Angular 20 guide** for naming conventions
4. **Follow styling guide** for Tailwind usage

### When Implementing:

1. **Use Dashboard component** for dashboard pages
2. **Create individual widgets** (NOT grouped cards)
3. **Use Datatable** for data grids
4. **Follow Shell patterns** exactly
5. **Use domain-driven naming** (e.g., `invoice-api.ts`, not `invoice.service.ts`)

---

## 🚨 Critical Rules

### ❌ DON'T:
- Create custom table components (use Datatable)
- Create custom dashboard layouts (use Dashboard)
- Use `.service.ts` suffix (use domain-driven names)
- Add `Component` suffix to class names (Angular 20)
- Deviate from Shell app patterns

### ✅ DO:
- Reference Shell for ALL UI patterns
- Use @ng-mf/components first
- Follow Angular 20 naming (no suffixes for components/services)
- Use Tailwind CSS 4 utilities
- Maintain consistency with Shell app

---

## 🎯 Quick Examples

### Creating an Invoice List Page

```typescript
// 1. Check Shell: apps/shell/src/app/applications/
// 2. Use Datatable from @ng-mf/components
import { Datatable } from '@ng-mf/components';

@Component({
  selector: 'app-invoice-list',
  imports: [Datatable],
  template: `
    <mf-datatable
      [data]="invoices()"
      [columns]="columns()"
      [loading]="loading()"
    />
  `
})
export class InvoiceList { // Angular 20: NO Component suffix
  private invoiceStore = inject(InvoiceStore);

  invoices = this.invoiceStore.invoices;
  loading = this.invoiceStore.loading;
}
```

### Creating Invoice Dashboard

```typescript
// 1. Check Shell: apps/shell/src/app/dashboard/
// 2. Use Dashboard component
import { Dashboard } from '@ng-mf/components';

@Component({
  selector: 'app-invoice-dashboard',
  imports: [Dashboard],
  template: `
    <mf-dashboard
      [configs]="configs()"
      [items]="items()"
    />
  `
})
export class InvoiceDashboard { // Angular 20: NO Component suffix
  configs = signal<WidgetConfig[]>([...]);
  items = signal<WidgetItem[]>([...]);
}
```

---

**Remember:** Always check Shell app first! It's your source of truth for implementation patterns. 🎯
