import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgerApi, SupplierLedgerEntry, SupplierAccountSummary } from '@samba/ledger-domain';
import { SupplierApi, Supplier } from '@samba/supplier-domain';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { Datatable } from '@ng-mf/components';
import { ColumnDef } from '@tanstack/angular-table';
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { BreadcrumbsStore, Panel, PanelHeader, PanelBody } from '@ng-mf/components';
import { MatCard, MatCardContent } from '@angular/material/card';

@Component({
  selector: 'app-supplier-ledger',
  standalone: true,
  imports: [
    MatButton,
    Icon,
    Datatable,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
    Panel,
    PanelHeader,
    PanelBody,
    MatCard,
    MatCardContent,
  ],
  templateUrl: './supplier-ledger.html',
  styleUrl: './supplier-ledger.scss'
})
export class SupplierLedger implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ledgerApi = inject(LedgerApi);
  private supplierApi = inject(SupplierApi);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  supplier = signal<Supplier | null>(null);
  ledgerEntries = signal<SupplierLedgerEntry[]>([]);
  summary = signal<SupplierAccountSummary | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  currentBalance = computed(() => {
    const entries = this.ledgerEntries();
    if (entries.length === 0) return 0;
    return entries[entries.length - 1]?.balance || 0;
  });

  columns: ColumnDef<SupplierLedgerEntry>[] = [
    {
      header: 'Date',
      accessorKey: 'transactionDate',
      cell: (info) => {
        const date = info.getValue() as Date;
        return new DatePipe('en-US').transform(date, 'MMM d, yyyy');
      },
    },
    {
      header: 'Type',
      accessorKey: 'transactionType',
      cell: (info) => {
        const type = info.getValue() as string;
        const typeMap: Record<string, { label: string; color: string }> = {
          PURCHASE: { label: 'Purchase', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
          RETURN: { label: 'Return', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
          PAYMENT: { label: 'Payment', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
          CREDIT_NOTE: { label: 'Credit Note', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
          ADJUSTMENT: { label: 'Adjustment', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
        };
        const config = typeMap[type] || { label: type, color: 'bg-gray-100 text-gray-800' };
        return `<span class="px-2 py-1 rounded-full text-xs font-medium ${config.color}">${config.label}</span>`;
      },
    },
    {
      header: 'Reference',
      accessorKey: 'referenceType',
      cell: (info) => {
        const row = info.row.original;
        return `${new TitleCasePipe().transform(row.referenceType)} #${row.referenceId}`;
      },
    },
    {
      header: 'Description',
      accessorKey: 'description',
      cell: (info) => info.getValue(),
    },
    {
      header: 'Debit',
      accessorKey: 'debit',
      cell: (info) => {
        const value = info.getValue() as number;
        return value > 0 ? new CurrencyPipe('en-US').transform(value, 'PKR ') : '-';
      },
    },
    {
      header: 'Credit',
      accessorKey: 'credit',
      cell: (info) => {
        const value = info.getValue() as number;
        return value > 0 ? new CurrencyPipe('en-US').transform(value, 'PKR ') : '-';
      },
    },
    {
      header: 'Balance',
      accessorKey: 'balance',
      cell: (info) => {
        const value = info.getValue() as number;
        const color = value > 0 ? 'text-red-600 dark:text-red-400' : value < 0 ? 'text-green-600 dark:text-green-400' : '';
        return `<span class="font-semibold ${color}">${new CurrencyPipe('en-US').transform(value, 'PKR ')}</span>`;
      },
    },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadSupplier(parseInt(id));
      this.loadLedger(parseInt(id));
    }
  }

  loadSupplier(id: number): void {
    this.supplierApi.getById(id).subscribe({
      next: (supplier) => {
        this.supplier.set(supplier);
        this.breadcrumbsStore.setBreadcrumbs([
          {
            id: 'home',
            name: 'Home',
            route: '/',
            type: 'link',
          },
          {
            id: 'suppliers',
            name: 'Suppliers',
            route: '/suppliers',
            type: 'link',
          },
          {
            id: 'supplier',
            name: supplier.name,
            route: `/suppliers/${supplier.id}`,
            type: 'link',
          },
          {
            id: 'ledger',
            name: 'Ledger',
            type: null,
          },
        ]);
      },
      error: (err) => {
        this.error.set('Failed to load supplier');
      }
    });
  }

  loadLedger(supplierId: number): void {
    this.isLoading.set(true);
    this.ledgerApi.getSupplierLedger(supplierId).subscribe({
      next: (response) => {
        this.ledgerEntries.set(response.entries);
        this.summary.set(response.summary);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load ledger entries');
        this.isLoading.set(false);
      }
    });
  }

  goBack(): void {
    const supplier = this.supplier();
    if (supplier) {
      this.router.navigate(['/suppliers', supplier.id]);
    } else {
      this.router.navigate(['/suppliers']);
    }
  }

  makePayment(): void {
    const supplier = this.supplier();
    if (supplier) {
      this.router.navigate(['/suppliers', supplier.id, 'payment']);
    }
  }
}
