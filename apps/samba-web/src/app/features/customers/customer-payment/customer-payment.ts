import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormField, MatLabel, MatError, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelect, MatOption } from '@angular/material/select';
import { DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { Icon } from '@ng-mf/components';
import { Panel, PanelHeader, PanelBody, BreadcrumbsStore } from '@ng-mf/components';
import { CustomerApi, Customer } from '@samba/customer-domain';
import { LedgerApi } from '@samba/ledger-domain';
import { AuthStore } from '@samba/user-domain';

type PaymentMethod = 'cash' | 'bank-transfer' | 'check' | 'card';

interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-customer-payment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatHint,
    MatInput,
    MatButton,
    MatProgressSpinner,
    MatDatepickerModule,
    MatSelect,
    MatOption,
    Icon,
    Panel,
    PanelHeader,
    PanelBody,
    RouterLink,
    DecimalPipe,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './customer-payment.html',
  styleUrl: './customer-payment.scss',
})
export class CustomerPayment implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private customerApi = inject(CustomerApi);
  private ledgerApi = inject(LedgerApi);
  private authStore = inject(AuthStore);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  customer = signal<Customer | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  paymentMethods: PaymentMethodOption[] = [
    {
      value: 'cash',
      label: 'Cash',
      icon: 'solar:wallet-money-line-duotone',
    },
    {
      value: 'bank-transfer',
      label: 'Bank Transfer',
      icon: 'solar:card-transfer-line-duotone',
    },
    {
      value: 'check',
      label: 'Check',
      icon: 'solar:bill-check-line-duotone',
    },
    {
      value: 'card',
      label: 'Card',
      icon: 'solar:card-line-duotone',
    },
  ];

  paymentForm = this.fb.group({
    amount: [0, [Validators.required, Validators.min(0.01)]],
    paymentDate: [new Date(), Validators.required],
    paymentMethod: ['cash' as PaymentMethod, Validators.required],
    referenceNumber: [''],
    notes: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCustomer(parseInt(id));
    } else {
      this.error.set('Customer ID not provided');
      this.router.navigate(['/customers']);
    }
  }

  loadCustomer(id: number): void {
    this.isLoading.set(true);
    this.customerApi.getById(id).subscribe({
      next: (customer) => {
        this.customer.set(customer);
        this.updateBreadcrumbs(customer.name);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load customer:', err);
        this.error.set('Failed to load customer');
        this.isLoading.set(false);
      },
    });
  }

  private updateBreadcrumbs(customerName: string): void {
    this.breadcrumbsStore.setBreadcrumbs([
      { id: 'home', name: 'Home', route: '/', type: 'link' },
      { id: 'customers', name: 'Customers', route: '/customers', type: 'link' },
      {
        id: 'customer',
        name: customerName,
        route: `/customers/${this.customer()?.id}`,
        type: 'link',
      },
      { id: 'payment', name: 'Record Payment', type: null },
    ]);
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const customer = this.customer();
    if (!customer) {
      this.error.set('Customer not found');
      return;
    }

    const user = this.authStore.user();
    if (!user) {
      this.error.set('User not authenticated');
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    const formValue = this.paymentForm.value;
    const amount = formValue.amount!;
    const paymentMethod = formValue.paymentMethod!;
    const referenceNumber = formValue.referenceNumber || '';
    const notes = formValue.notes || '';

    const description = `Payment via ${this.getPaymentMethodLabel(paymentMethod)}${referenceNumber ? ` - Ref: ${referenceNumber}` : ''}${notes ? ` - ${notes}` : ''}`;

    this.ledgerApi.recordPayment(customer.id, amount, description).subscribe({
      next: () => {
        this.success.set(true);
        this.isSaving.set(false);
        // Navigate back to customer detail or ledger
        setTimeout(() => {
          this.router.navigate(['/customers', customer.id]);
        }, 1500);
      },
      error: (err) => {
        console.error('Failed to record payment:', err);
        this.error.set('Failed to record payment');
        this.isSaving.set(false);
      },
    });
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    const option = this.paymentMethods.find((m) => m.value === method);
    return option?.label || method;
  }

  cancel(): void {
    const customer = this.customer();
    if (customer) {
      this.router.navigate(['/customers', customer.id]);
    } else {
      this.router.navigate(['/customers']);
    }
  }

  getErrorMessage(field: string): string {
    const control = this.paymentForm.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('min')) {
      return 'Amount must be greater than 0';
    }
    return '';
  }
}
