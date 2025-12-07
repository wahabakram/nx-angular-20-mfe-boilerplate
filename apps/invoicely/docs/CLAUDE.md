# Invoicely - Claude Development Guide

> **App-Specific Context**: This guide provides Invoicely-specific patterns, architecture decisions, and development workflows. For workspace-wide context, see [/.claude/](../../../.claude/)

**Last Updated:** December 7, 2025

---

## 📋 Quick Reference

| Item | Value |
|------|-------|
| **App Name** | Invoicely |
| **Purpose** | Invoice & Payment Management System |
| **Port** | 4200 |
| **Architecture** | Domain-Driven Design with Signal Stores |
| **MFE Type** | Remote (can be loaded by Shell) |
| **Primary Users** | Small businesses, freelancers, agencies |

---

## 🎯 Application Overview

Invoicely is a **comprehensive invoice and payment management system** built with Angular 20 and Domain-Driven Design principles. It handles the complete invoice lifecycle from creation to payment tracking.

### Core Features

1. **Invoice Management**
   - Create, edit, and send invoices
   - Multiple templates and customization
   - PDF generation and export
   - Recurring invoices support

2. **Client Management**
   - Client profiles and contact info
   - Payment history tracking
   - Client portal access

3. **Payment Tracking**
   - Payment status monitoring
   - Multiple payment methods
   - Payment reminders
   - Receipt generation

4. **Reporting**
   - Revenue analytics
   - Outstanding invoices
   - Payment trends
   - Tax reporting

---

## 🏗️ Architecture

### Domain Structure

```
apps/invoicely/src/app/_domain/
├── client/           Client management domain
│   ├── models/       Client models
│   ├── services/     Client business logic
│   └── store/        Client state management
│
├── invoice/          Invoice domain
│   ├── models/       Invoice, LineItem models
│   ├── services/     Invoice operations
│   └── store/        Invoice state
│
├── payment/          Payment domain
│   ├── models/       Payment models
│   ├── services/     Payment processing
│   └── store/        Payment state
│
├── report/           Reporting domain
│   ├── models/       Report models
│   └── services/     Analytics & reporting
│
└── user/            User/Auth domain
    ├── models/       User models
    ├── services/     Auth & profile
    └── store/        User state
```

### Application Structure

```
apps/invoicely/src/app/
├── _domain/          Domain logic (business rules)
├── _infrastructure/  Cross-cutting concerns
│   ├── api/         API communication
│   ├── guards/      Route guards
│   ├── interceptors/ HTTP interceptors
│   └── utils/       Helper functions
│
├── _shared/          Shared UI components
│   ├── components/   Reusable components
│   ├── layouts/      Page layouts
│   └── widgets/      Dashboard widgets
│
├── auth/            Authentication pages
├── clients/         Client management pages
├── invoices/        Invoice CRUD pages
├── payments/        Payment management pages
├── profile/         User profile pages
├── reports/         Analytics & reporting
└── settings/        App configuration
```

---

## 🎨 Key Patterns

### 1. Domain-Driven Design

**Pattern**: Separate business logic from UI concerns

```typescript
// Domain Model (apps/invoicely/src/app/_domain/invoice/models/invoice.model.ts)
export interface Invoice {
  id: string;
  invoiceNumber: string;
  client: Client;
  lineItems: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

// Domain Service (apps/invoicely/src/app/_domain/invoice/services/invoice.service.ts)
@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private apiService = inject(ApiService);

  getInvoices(): Observable<Invoice[]> {
    return this.apiService.get<Invoice[]>('/invoices');
  }

  createInvoice(invoice: Partial<Invoice>): Observable<Invoice> {
    return this.apiService.post<Invoice>('/invoices', invoice);
  }

  calculateTotal(lineItems: LineItem[], taxRate: number): number {
    const subtotal = lineItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const tax = subtotal * (taxRate / 100);
    return subtotal + tax;
  }
}

// Domain Store (apps/invoicely/src/app/_domain/invoice/store/invoice.store.ts)
import { signalStore, withState, withMethods } from '@ngrx/signals';

export const InvoiceStore = signalStore(
  { providedIn: 'root' },
  withState({
    invoices: [] as Invoice[],
    selectedInvoice: null as Invoice | null,
    loading: false,
    error: null as string | null,
  }),
  withMethods((store, invoiceService = inject(InvoiceService)) => ({
    async loadInvoices() {
      patchState(store, { loading: true });
      try {
        const invoices = await firstValueFrom(invoiceService.getInvoices());
        patchState(store, { invoices, loading: false });
      } catch (error) {
        patchState(store, { error: error.message, loading: false });
      }
    },
    
    selectInvoice(invoice: Invoice) {
      patchState(store, { selectedInvoice: invoice });
    },
  })),
);
```

### 2. Component Pattern

**Pattern**: Use stores and services in components

```typescript
// Component (apps/invoicely/src/app/invoices/invoice-list/invoice-list.ts)
import { Component, inject, OnInit } from '@angular/core';
import { InvoiceStore } from '@invoicely/domain/invoice';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, Datatable],
  templateUrl: './invoice-list.html',
  styleUrl: './invoice-list.scss',
})
export class InvoiceList implements OnInit {
  private invoiceStore = inject(InvoiceStore);

  // Expose signals from store
  invoices = this.invoiceStore.invoices;
  loading = this.invoiceStore.loading;

  ngOnInit() {
    this.invoiceStore.loadInvoices();
  }

  onInvoiceClick(invoice: Invoice) {
    this.invoiceStore.selectInvoice(invoice);
    this.router.navigate(['/invoices', invoice.id]);
  }
}
```

### 3. Shared Components

**Pattern**: Import from shared library first, create custom only if needed

```typescript
// ✅ GOOD - Use shared components
import { 
  Datatable, 
  FormRenderer, 
  Dashboard,
  Panel 
} from '@ng-mf/components';

// ❌ AVOID - Don't recreate existing components
// Creating custom table when Datatable exists
```

---

## 🧩 Feature Implementation Guide

### Creating a New Feature

**Example**: Adding a "Payment Reminders" feature

#### 1. Domain Layer

```typescript
// 1a. Create model
// apps/invoicely/src/app/_domain/payment/models/reminder.model.ts
export interface PaymentReminder {
  id: string;
  invoiceId: string;
  recipientEmail: string;
  scheduledDate: Date;
  status: 'pending' | 'sent' | 'failed';
  template: string;
}

// 1b. Add service method
// apps/invoicely/src/app/_domain/payment/services/payment.service.ts
scheduleReminder(reminder: Partial<PaymentReminder>): Observable<PaymentReminder> {
  return this.apiService.post<PaymentReminder>('/payment-reminders', reminder);
}

// 1c. Extend store
// apps/invoicely/src/app/_domain/payment/store/payment.store.ts
withState({
  reminders: [] as PaymentReminder[],
}),
withMethods((store) => ({
  async scheduleReminder(reminder: Partial<PaymentReminder>) {
    const newReminder = await firstValueFrom(
      paymentService.scheduleReminder(reminder)
    );
    patchState(store, { 
      reminders: [...store.reminders(), newReminder] 
    });
  },
})),
```

#### 2. Component Layer

```typescript
// 2a. Create component
// apps/invoicely/src/app/payments/payment-reminders/payment-reminders.ts
@Component({
  selector: 'app-payment-reminders',
  standalone: true,
  imports: [CommonModule, Datatable, FormRenderer],
  templateUrl: './payment-reminders.html',
})
export class PaymentReminders {
  private paymentStore = inject(PaymentStore);
  
  reminders = this.paymentStore.reminders;

  onScheduleReminder(data: Partial<PaymentReminder>) {
    this.paymentStore.scheduleReminder(data);
  }
}
```

#### 3. Add Route

```typescript
// apps/invoicely/src/app/payments/payments.routes.ts
export const paymentsRoutes: Routes = [
  {
    path: '',
    component: PaymentList,
  },
  {
    path: 'reminders',
    component: PaymentReminders, // New route
  },
];
```

---

## 📊 Dashboard & Widgets

### Dashboard Structure

Invoicely uses the **Dashboard component** from `@ng-mf/components` for all dashboard pages.

```typescript
// apps/invoicely/src/app/dashboard/overview/overview.ts
import { Component, signal } from '@angular/core';
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [Dashboard],
  template: `
    <mf-dashboard 
      [configs]="widgetConfigs()" 
      [items]="widgetItems()" />
  `,
})
export class DashboardOverview {
  widgetConfigs = signal<WidgetConfig[]>([
    {
      id: 'total-revenue',
      component: TotalRevenueWidget,
      title: 'Total Revenue',
      allowRemove: false,
    },
    {
      id: 'outstanding-invoices',
      component: OutstandingInvoicesWidget,
      title: 'Outstanding Invoices',
    },
    {
      id: 'recent-payments',
      component: RecentPaymentsWidget,
      title: 'Recent Payments',
    },
  ]);

  widgetItems = signal<WidgetItem[]>([
    { i: 'total-revenue', x: 0, y: 0, w: 4, h: 2 },
    { i: 'outstanding-invoices', x: 4, y: 0, w: 4, h: 2 },
    { i: 'recent-payments', x: 0, y: 2, w: 8, h: 3 },
  ]);
}
```

### Creating Widgets

```typescript
// apps/invoicely/src/app/_shared/widgets/total-revenue/total-revenue-widget.ts
@Component({
  selector: 'app-total-revenue-widget',
  standalone: true,
  template: `
    <div class="p-6">
      <div class="text-3xl font-bold">{{ totalRevenue() | currency }}</div>
      <div class="text-sm text-gray-500">This Month</div>
      <div class="mt-2 text-green-600">
        ↑ {{ growthPercentage() }}% from last month
      </div>
    </div>
  `,
})
export class TotalRevenueWidget {
  private invoiceStore = inject(InvoiceStore);
  
  totalRevenue = computed(() => {
    return this.invoiceStore.invoices()
      .filter(inv => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.total, 0);
  });
  
  growthPercentage = signal(12.5);
}
```

---

## 🎨 Styling Guidelines

### Using Tailwind CSS

```html
<!-- ✅ GOOD - Tailwind utility classes -->
<div class="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h2 class="text-xl font-semibold text-gray-900">Invoice #1234</h2>
  <span class="px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
    Paid
  </span>
</div>

<!-- ❌ AVOID - Inline styles -->
<div style="display: flex; padding: 16px;">
  <h2 style="font-size: 20px;">Invoice #1234</h2>
</div>
```

### Component-Specific Styles (SCSS)

```scss
// invoice-list.scss
:host {
  display: block;
  padding: 1.5rem;
}

.invoice-card {
  @apply rounded-lg shadow-sm border border-gray-200;
  transition: box-shadow 0.2s;

  &:hover {
    @apply shadow-md;
  }

  &.overdue {
    @apply border-red-300 bg-red-50;
  }
}
```

---

## 🔐 Authentication & Guards

### Auth Guard

```typescript
// apps/invoicely/src/app/_infrastructure/guards/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  if (authStore.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/signin'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};
```

### Using Guards in Routes

```typescript
// apps/invoicely/src/app/invoices/invoices.routes.ts
export const invoicesRoutes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', component: InvoiceList },
      { path: 'create', component: InvoiceCreate },
      { path: ':id', component: InvoiceDetail },
    ],
  },
];
```

---

## 📝 Forms & Validation

### Using FormRenderer

```typescript
// Invoice form configuration
const invoiceFormConfig: FormConfig = {
  fields: [
    {
      type: 'select',
      name: 'clientId',
      label: 'Client',
      required: true,
      options: clients().map(c => ({ value: c.id, label: c.name })),
    },
    {
      type: 'date',
      name: 'dueDate',
      label: 'Due Date',
      required: true,
    },
    {
      type: 'array',
      name: 'lineItems',
      label: 'Line Items',
      fields: [
        { type: 'text', name: 'description', label: 'Description' },
        { type: 'number', name: 'quantity', label: 'Quantity' },
        { type: 'number', name: 'price', label: 'Price' },
      ],
    },
  ],
};

// Template
<mf-form-renderer 
  [config]="invoiceFormConfig" 
  (submit)="onSubmit($event)" />
```

---

## 🧪 Testing

### Unit Testing Components

```typescript
// invoice-list.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvoiceList } from './invoice-list';
import { InvoiceStore } from '@invoicely/domain/invoice';

describe('InvoiceList', () => {
  let component: InvoiceList;
  let fixture: ComponentFixture<InvoiceList>;
  let store: InvoiceStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoiceList],
      providers: [InvoiceStore],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceList);
    component = fixture.componentInstance;
    store = TestBed.inject(InvoiceStore);
  });

  it('should load invoices on init', () => {
    const spy = jest.spyOn(store, 'loadInvoices');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
});
```

---

## 🚀 Development Workflow

### Starting Development

```bash
# Start Invoicely app
npm run start:invoicely

# Visit http://localhost:4200
```

### Building

```bash
# Development build
npx nx build invoicely

# Production build
npx nx build invoicely --configuration=production
```

### Testing

```bash
# Run unit tests
npx nx test invoicely

# Run E2E tests
npx nx e2e invoicely-e2e
```

---

## 📚 Related Documentation

- **Root**: [../../../.claude/](../../../.claude/) - Global Claude AI context
- **Architecture**: [../../../.claude/ARCHITECTURE.md](../../../.claude/ARCHITECTURE.md)
- **Shared Components**: [../../../libs/shared/components/docs/README.md](../../../libs/shared/components/docs/README.md)
- **Shell App**: [../../shell/docs/README.md](../../shell/docs/README.md) - Reference patterns

---

## ⚠️ Common Patterns to Follow

### DO ✅

- Use domain stores for state management
- Import from `@ng-mf/components` first
- Follow Angular 20 signal patterns
- Use Tailwind CSS utilities
- Keep business logic in domain layer
- Test domain services and stores

### DON'T ❌

- Mix business logic with UI components
- Create components that already exist in shared lib
- Use inline styles instead of Tailwind
- Put API calls directly in components
- Ignore TypeScript type safety
- Skip unit tests

---

## 🎯 Key Principles

1. **Domain-Driven Design** - Business logic separated from UI
2. **Signal-Based State** - Use Angular signals and NgRx signals
3. **Component Reuse** - Import from shared library first
4. **Type Safety** - Strict TypeScript types
5. **Clean Architecture** - Clear separation of concerns
6. **Test Coverage** - Unit tests for domain logic

---

**Keep this guide open when developing Invoicely features!**

*Last Updated: December 7, 2025*
