import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Datatable, Panel, PanelBody, PanelHeader, BreadcrumbsStore } from '@ng-mf/components';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { SaleService, SaleStore, Sale } from '@samba/sale-domain';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { SalesActionsCell } from '../../../_cells/sales-actions-cell/sales-actions-cell';

@Component({
  selector: 'app-sales-list',
  imports: [
    Datatable,
    Panel,
    PanelHeader,
    PanelBody,
    MatButton,
    MatIcon,
  ],
  templateUrl: './sales-list.html',
  styleUrl: './sales-list.scss',
})
export class SalesList implements OnInit {
  private saleService = inject(SaleService);
  private saleStore = inject(SaleStore);
  private router = inject(Router);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  sales = this.saleStore.sales;
  isLoading = signal(false);
  error = signal<string | null>(null);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'sales',
        name: 'Sales',
        type: null,
      },
    ]);
  }

  columns = signal<ColumnDef<Sale>[]>([
    {
      header: 'Sale ID',
      accessorKey: 'id',
      size: 100,
      cell: (info) => `#${info.getValue()}`,
    },
    {
      header: 'Date',
      accessorKey: 'saleDate',
      size: 150,
      cell: (info) => {
        const date = info.getValue() as string;
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    {
      header: 'Customer',
      accessorKey: 'customerId',
      size: 150,
      cell: (info) => {
        const customerId = info.getValue() as number | undefined;
        return customerId ? `Customer #${customerId}` : 'Walk-in';
      },
    },
    {
      header: 'Items',
      accessorKey: 'items',
      size: 100,
      cell: (info) => {
        const items = info.getValue() as any[];
        const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
        return `${totalQty} items`;
      },
    },
    {
      header: 'Subtotal',
      accessorKey: 'subtotal',
      size: 120,
      cell: (info) => `$${(info.getValue() as number)?.toFixed(2)}`,
    },
    {
      header: 'Tax',
      accessorKey: 'taxAmount',
      size: 100,
      cell: (info) => `$${(info.getValue() as number)?.toFixed(2)}`,
    },
    {
      header: 'Total',
      accessorKey: 'totalAmount',
      size: 120,
      cell: (info) => {
        const total = info.getValue() as number;
        return `<span class="font-semibold text-primary">$${total?.toFixed(
          2
        )}</span>`;
      },
    },
    {
      header: 'Payment',
      accessorKey: 'paymentMethod',
      size: 120,
      cell: (info) => {
        const method = info.getValue() as string;
        const colorMap: Record<string, string> = {
          cash: 'bg-success/10 text-success',
          card: 'bg-primary/10 text-primary',
          'mobile-wallet': 'bg-secondary/10 text-secondary',
          bank_transfer: 'bg-tertiary/10 text-tertiary',
        };
        const color = colorMap[method] || 'bg-neutral/10 text-neutral';
        return `<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium ${color}">${method
          .replace('_', ' ')
          .replace('-', ' ')}</span>`;
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      size: 120,
      cell: (info) => {
        const status = info.getValue() as string;
        const colorMap: Record<string, string> = {
          completed: 'bg-success/10 text-success',
          pending: 'bg-warning/10 text-warning',
          cancelled: 'bg-error/10 text-error',
          refunded: 'bg-neutral/10 text-neutral',
        };
        const color = colorMap[status] || 'bg-neutral/10 text-neutral';
        return `<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium ${color}">${status}</span>`;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'id',
      size: 120,
      enableSorting: false,
      meta: {
        pinned: 'right',
      },
      cell: (info) => {
        return flexRenderComponent(SalesActionsCell, {
          inputs: {
            row: info.row.original,
          },
        });
      },
    },
  ]);

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.isLoading.set(true);
    this.saleService.getAll().subscribe({
      next: (sales) => {
        this.saleStore.setSales(sales);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load sales');
        this.isLoading.set(false);
      },
    });
  }

  onTableInteraction(event: any): void {
    const target = event.target as HTMLElement;
    const viewBtn = target.closest('.view-btn');

    if (viewBtn) {
      const saleId = viewBtn.getAttribute('data-id');
      if (saleId) {
        this.viewSale(parseInt(saleId));
      }
    }
  }

  viewSale(id: number): void {
    this.router.navigate(['/sales', id]);
  }
}
