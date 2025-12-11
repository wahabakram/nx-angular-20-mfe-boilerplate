import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgerApi, LedgerStore, CustomerLedgerEntry } from '@samba/ledger-domain';
import { CustomerApi } from '@samba/customer-domain';
import { Page } from '../../../_partials/page/page';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { Datatable, Panel, PanelBody, PanelHeader, BreadcrumbsStore } from '@ng-mf/components';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { DatePipe, DecimalPipe, TitleCasePipe } from '@angular/common';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-ledger',
  imports: [
    Page,
    MatButton,
    Icon,
    Datatable,
    Panel,
    PanelHeader,
    PanelBody,
    DatePipe,
    DecimalPipe,
    TitleCasePipe,
    MatCard,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    FormsModule,
  ],
  templateUrl: './customer-ledger.html',
  styleUrl: './customer-ledger.scss',
})
export class CustomerLedger implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ledgerApi = inject(LedgerApi);
  private ledgerStore = inject(LedgerStore);
  private customerApi = inject(CustomerApi);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  customerId = signal<number>(0);
  customerName = signal<string>('');
  entries = this.ledgerStore.entries;
  summary = this.ledgerStore.summary;
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Filter options
  transactionTypes = [
    { value: '', label: 'All Types' },
    { value: 'SALE', label: 'Sale' },
    { value: 'RETURN', label: 'Return' },
    { value: 'PAYMENT', label: 'Payment' },
    { value: 'CREDIT_NOTE', label: 'Credit Note' },
    { value: 'ADJUSTMENT', label: 'Adjustment' },
  ];

  selectedType = signal<string>('');
  startDate = signal<string>('');
  endDate = signal<string>('');

  columns = signal<ColumnDef<CustomerLedgerEntry>[]>([
    {
      header: 'Date',
      accessorKey: 'transactionDate',
      size: 150,
      cell: (info) => {
        const date = info.getValue() as string;
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      },
    },
    {
      header: 'Type',
      accessorKey: 'transactionType',
      size: 120,
      cell: (info) => {
        const type = info.getValue() as string;
        const colorMap: Record<string, string> = {
          SALE: 'bg-primary/10 text-primary',
          RETURN: 'bg-success/10 text-success',
          PAYMENT: 'bg-info/10 text-info',
          CREDIT_NOTE: 'bg-secondary/10 text-secondary',
          ADJUSTMENT: 'bg-warning/10 text-warning',
        };
        const color = colorMap[type] || 'bg-neutral/10 text-neutral';
        return `<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium ${color}">${type.replace(
          '_',
          ' '
        )}</span>`;
      },
    },
    {
      header: 'Reference',
      accessorKey: 'referenceId',
      size: 120,
      cell: (info) => {
        const refId = info.getValue() as number;
        const refType = info.row.original.referenceType;
        return `${refType.toUpperCase()}-${refId}`;
      },
    },
    {
      header: 'Description',
      accessorKey: 'description',
      size: 250,
    },
    {
      header: 'Debit',
      accessorKey: 'debit',
      size: 120,
      cell: (info) => {
        const amount = info.getValue() as number;
        return amount > 0
          ? `<span class="text-success">Rs ${amount.toFixed(2)}</span>`
          : '-';
      },
    },
    {
      header: 'Credit',
      accessorKey: 'credit',
      size: 120,
      cell: (info) => {
        const amount = info.getValue() as number;
        return amount > 0
          ? `<span class="text-error">Rs ${amount.toFixed(2)}</span>`
          : '-';
      },
    },
    {
      header: 'Balance',
      accessorKey: 'balance',
      size: 120,
      cell: (info) => {
        const balance = info.getValue() as number;
        const colorClass = balance > 0 ? 'text-error' : balance < 0 ? 'text-success' : '';
        return `<span class="font-semibold ${colorClass}">Rs ${balance.toFixed(
          2
        )}</span>`;
      },
    },
  ]);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const customerId = parseInt(id);
      this.customerId.set(customerId);
      this.loadCustomerInfo(customerId);
      this.loadLedger(customerId);

      this.breadcrumbsStore.setBreadcrumbs([
        { id: 'home', name: 'Home', route: '/', type: 'link' },
        { id: 'customers', name: 'Customers', route: '/customers', type: 'link' },
        { id: 'ledger', name: 'Ledger', type: null },
      ]);
    }
  }

  loadCustomerInfo(customerId: number): void {
    this.customerApi.getById(customerId).subscribe({
      next: (customer) => {
        this.customerName.set(customer.name);
      },
      error: (err) => {
        console.error('Error loading customer:', err);
      },
    });
  }

  loadLedger(customerId: number): void {
    this.isLoading.set(true);
    this.ledgerStore.setCurrentCustomerId(customerId);

    const params: any = {};
    if (this.selectedType()) params.transactionType = this.selectedType();
    if (this.startDate()) params.startDate = new Date(this.startDate());
    if (this.endDate()) params.endDate = new Date(this.endDate());

    this.ledgerApi.getCustomerLedger(customerId, params).subscribe({
      next: (response) => {
        this.ledgerStore.setEntries(response.entries);
        this.ledgerStore.setSummary(response.summary);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load ledger');
        this.isLoading.set(false);
      },
    });
  }

  applyFilters(): void {
    const customerId = this.customerId();
    if (customerId) {
      this.loadLedger(customerId);
    }
  }

  clearFilters(): void {
    this.selectedType.set('');
    this.startDate.set('');
    this.endDate.set('');
    const customerId = this.customerId();
    if (customerId) {
      this.loadLedger(customerId);
    }
  }

  goBack(): void {
    this.router.navigate(['/customers']);
  }

  recordPayment(): void {
    const customerId = this.customerId();
    if (customerId) {
      this.router.navigate(['/customers', customerId, 'payment']);
    }
  }

  exportToPDF(): void {
    window.print();
  }
}
