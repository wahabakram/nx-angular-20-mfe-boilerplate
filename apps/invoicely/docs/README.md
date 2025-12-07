# Invoicely - Documentation Index

## About Invoicely
Invoicely is a comprehensive invoice management application built with Angular 20, providing end-to-end invoice lifecycle management from creation to payment tracking.

## Overview

Invoicely is a microfrontend application that handles all aspects of invoice management for businesses, including client management, invoice generation, payment tracking, and reporting.

## Key Features

### Invoice Management
- **Create Invoices**: Professional invoice generation with customizable templates
- **Edit Invoices**: Update invoice details before sending
- **Track Status**: Monitor invoice lifecycle (draft, sent, paid, overdue)
- **Templates**: Customizable invoice templates
- **Recurring Invoices**: Automated recurring invoice generation

### Client Management
- **Client Database**: Maintain client information and history
- **Contact Details**: Multiple contacts per client
- **Payment Terms**: Client-specific payment terms and conditions
- **Credit Management**: Track client credit limits and history

### Payment Tracking
- **Payment Records**: Track received payments
- **Partial Payments**: Handle partial payment scenarios
- **Payment Methods**: Support multiple payment methods
- **Payment Reminders**: Automated payment reminder system

### Reports & Analytics
- **Revenue Reports**: Track income over time
- **Outstanding Reports**: Monitor unpaid invoices
- **Client Reports**: Per-client financial analysis
- **Tax Reports**: Generate tax-ready reports

## Architecture

### Domain Structure
```
apps/invoicely/src/app/_domain/
├── invoice/          - Invoice entities and services
├── client/           - Client management
├── payment/          - Payment processing
├── report/           - Reporting and analytics
└── user/             - User preferences and settings
```

### Application Structure
```
apps/invoicely/src/app/
├── _domain/              - Domain layer (business logic)
├── _infrastructure/      - Infrastructure layer (API, storage)
├── _shared/              - Shared components and utilities
├── invoices/             - Invoice feature module
├── clients/              - Client management module
├── payments/             - Payment tracking module
├── reports/              - Reports and analytics module
└── settings/             - Application settings
```

## Development Guidelines

### Feature Development Flow

1. **Domain Layer**
   - Define entities (Invoice, Client, Payment)
   - Create services for business logic
   - Define repository interfaces

2. **Infrastructure Layer**
   - Implement repositories (API calls)
   - Handle data persistence
   - Manage external integrations

3. **Application Layer**
   - Create facades for coordination
   - Implement state management
   - Handle use cases

4. **Presentation Layer**
   - Build components and forms
   - Implement UI logic
   - Handle user interactions

### Code Organization

#### Domain Models
```typescript
// apps/invoicely/src/app/_domain/invoice/models/invoice.model.ts
export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  date: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
}
```

#### Services
```typescript
// apps/invoicely/src/app/_domain/invoice/services/invoice.service.ts
@Injectable()
export class InvoiceService {
  calculateTotal(items: InvoiceItem[]): number {
    // Business logic
  }
  
  isOverdue(invoice: Invoice): boolean {
    // Business logic
  }
}
```

#### Repositories
```typescript
// apps/invoicely/src/app/_infrastructure/api/invoice-api.service.ts
@Injectable()
export class InvoiceApiService implements InvoiceRepository {
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>('/api/invoices');
  }
}
```

#### Facades
```typescript
// apps/invoicely/src/app/_domain/invoice/facades/invoice.facade.ts
@Injectable()
export class InvoiceFacade {
  readonly invoices$ = this.invoiceStore.invoices$;
  readonly loading$ = this.invoiceStore.loading$;
  
  loadInvoices(): void {
    this.invoiceStore.loadInvoices();
  }
}
```

## Module Federation

### Configuration
```typescript
// module-federation.config.ts
module.exports = {
  name: 'invoicely',
  exposes: {
    './Routes': './src/app/remote-entry/entry.routes.ts'
  },
  shared: {
    '@angular/core': { singleton: true, strictVersion: true },
    '@angular/common': { singleton: true, strictVersion: true }
  }
};
```

### Integration with Shell
```typescript
// In shell app
{
  path: 'invoicely',
  loadChildren: () => loadRemoteModule('invoicely', './Routes')
}
```

## State Management

### Signal-Based Store
```typescript
export const InvoiceStore = signalStore(
  { providedIn: 'root' },
  withState({
    invoices: [] as Invoice[],
    selectedInvoice: null as Invoice | null,
    loading: false,
    error: null as string | null
  }),
  withMethods((store, invoiceApi = inject(InvoiceApiService)) => ({
    async loadInvoices() {
      patchState(store, { loading: true });
      const invoices = await invoiceApi.getInvoices();
      patchState(store, { invoices, loading: false });
    }
  }))
);
```

## Forms & Validation

### Invoice Form
```typescript
export class InvoiceFormComponent {
  form = this.fb.group({
    clientId: ['', Validators.required],
    date: [new Date(), Validators.required],
    dueDate: ['', Validators.required],
    items: this.fb.array([]),
    notes: ['']
  });
  
  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }
  
  addItem(): void {
    this.items.push(this.createItemFormGroup());
  }
}
```

## API Integration

### Endpoints
```
GET    /api/invoices              - List all invoices
GET    /api/invoices/:id          - Get invoice details
POST   /api/invoices              - Create invoice
PUT    /api/invoices/:id          - Update invoice
DELETE /api/invoices/:id          - Delete invoice
POST   /api/invoices/:id/send     - Send invoice to client
POST   /api/invoices/:id/payment  - Record payment

GET    /api/clients               - List all clients
POST   /api/clients               - Create client
PUT    /api/clients/:id           - Update client

GET    /api/payments              - List payments
POST   /api/payments              - Record payment

GET    /api/reports/revenue       - Revenue report
GET    /api/reports/outstanding   - Outstanding invoices
```

## Testing Strategy

### Unit Tests
- Services: Business logic, calculations
- Components: User interactions, form validation
- Pipes: Data transformation
- Utilities: Helper functions

### Integration Tests
- API calls and responses
- State management updates
- Form submissions
- Navigation flows

### E2E Tests
- Create invoice flow
- Payment recording flow
- Invoice status updates
- Client management

## Common Features

### Invoice Generation
1. Select client
2. Add invoice items
3. Calculate totals
4. Generate PDF
5. Send to client

### Payment Recording
1. Select invoice
2. Enter payment amount
3. Select payment method
4. Update invoice status
5. Send receipt

### Report Generation
1. Select report type
2. Choose date range
3. Apply filters
4. Generate report
5. Export (PDF/Excel)

## UI Components

### Invoice List
- Data table with sorting/filtering
- Status badges
- Quick actions (view, edit, delete)
- Bulk operations

### Invoice Detail
- Invoice header (number, date, status)
- Client information
- Line items table
- Totals calculation
- Payment history
- Action buttons

### Invoice Form
- Client selector
- Date pickers
- Dynamic line items
- Tax calculation
- Notes section
- Save/send buttons

## Styling & Themes

### Using Shared Styles
```scss
@import 'libs/shared/styles/common';

.invoice-card {
  @include card-style;
  padding: 1rem;
}
```

### Theme Variables
```scss
.invoice-status {
  &--paid { color: var(--success-color); }
  &--pending { color: var(--warning-color); }
  &--overdue { color: var(--error-color); }
}
```

## Performance Optimization

### Lazy Loading
- Route-level lazy loading
- Component lazy loading for heavy components
- Image lazy loading

### Change Detection
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### Virtual Scrolling
```html
<cdk-virtual-scroll-viewport itemSize="50">
  <div *cdkVirtualFor="let invoice of invoices">
    {{ invoice.number }}
  </div>
</cdk-virtual-scroll-viewport>
```

## Security

### Input Validation
- Client-side validation
- Server-side validation
- XSS prevention
- SQL injection prevention

### Authorization
- Role-based access control
- Invoice ownership validation
- Payment authorization
- Report access control

## Deployment

### Development
```bash
nx serve invoicely
# Available at http://localhost:4202
```

### Production Build
```bash
nx build invoicely --prod
```

### Environment Configuration
```typescript
// environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.invoicely.com',
  features: {
    recurringInvoices: true,
    paymentGateway: true
  }
};
```

## Related Documentation

- **Root**: [../../.claude/](../../.claude/) - Global Claude AI context
- **Shell**: [../shell/docs/](../shell/docs/) - Shell application
- **Shared Components**: [../../libs/shared/components/docs/](../../libs/shared/components/docs/)

## Future Enhancements

- [ ] Multi-currency support
- [ ] Online payment integration
- [ ] Automated dunning
- [ ] Invoice templates marketplace
- [ ] Client portal
- [ ] Mobile app integration
- [ ] QuickBooks/Xero integration
- [ ] Expense tracking
- [ ] Time tracking integration
- [ ] Advanced analytics dashboard
