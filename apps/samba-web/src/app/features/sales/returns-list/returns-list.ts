import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Datatable, Panel, PanelBody, PanelHeader, BreadcrumbsStore } from '@ng-mf/components';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { ReturnApi, ReturnStore, Return } from '@samba/return-domain';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { ReturnActionsCell } from '../../../_cells/return-actions-cell/return-actions-cell';

@Component({
  selector: 'app-returns-list',
  imports: [
    Datatable,
    Panel,
    PanelHeader,
    PanelBody,
    MatButton,
    Icon,
  ],
  templateUrl: './returns-list.html',
  styleUrl: './returns-list.scss',
})
export class ReturnsList implements OnInit {
  private returnApi = inject(ReturnApi);
  private returnStore = inject(ReturnStore);
  private router = inject(Router);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  returns = this.returnStore.returns;
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
        route: '/sales',
        type: 'link',
      },
      {
        id: 'returns',
        name: 'Returns',
        type: null,
      },
    ]);
  }

  columns = signal<ColumnDef<Return>[]>([
    {
      header: 'Return ID',
      accessorKey: 'id',
      size: 100,
      cell: (info) => `#${info.getValue()}`,
    },
    {
      header: 'Date',
      accessorKey: 'returnDate',
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
      header: 'Sale Number',
      accessorKey: 'saleId',
      size: 120,
      cell: (info) => `SALE-${info.getValue()}`,
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
      header: 'Items Returned',
      accessorKey: 'items',
      size: 120,
      cell: (info) => {
        const items = info.getValue() as any[];
        const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
        return `${totalQty} item${totalQty !== 1 ? 's' : ''}`;
      },
    },
    {
      header: 'Refund Amount',
      accessorKey: 'refundAmount',
      size: 120,
      cell: (info) => {
        const amount = info.getValue() as number;
        return `<span class="font-semibold text-error">Rs ${amount?.toFixed(
          2
        )}</span>`;
      },
    },
    {
      header: 'Refund Method',
      accessorKey: 'refundMethod',
      size: 120,
      cell: (info) => {
        const method = info.getValue() as string;
        const colorMap: Record<string, string> = {
          cash: 'bg-success/10 text-success',
          card: 'bg-primary/10 text-primary',
          'credit-note': 'bg-secondary/10 text-secondary',
          exchange: 'bg-tertiary/10 text-tertiary',
        };
        const color = colorMap[method] || 'bg-neutral/10 text-neutral';
        return `<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium ${color}">${method
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
          rejected: 'bg-error/10 text-error',
          'in-review': 'bg-info/10 text-info',
        };
        const color = colorMap[status] || 'bg-neutral/10 text-neutral';
        return `<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium ${color}">${status}</span>`;
      },
    },
    {
      header: 'Processed By',
      accessorKey: 'processedBy',
      size: 150,
      cell: (info) => {
        const userId = info.getValue() as number;
        return `User #${userId}`;
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
        return flexRenderComponent(ReturnActionsCell, {
          inputs: {
            row: info.row.original,
          },
        });
      },
    },
  ]);

  ngOnInit(): void {
    this.loadReturns();
  }

  loadReturns(): void {
    this.isLoading.set(true);
    this.returnApi.getAll().subscribe({
      next: (returns) => {
        this.returnStore.setReturns(returns);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load returns');
        this.isLoading.set(false);
      },
    });
  }

  onTableInteraction(event: any): void {
    const target = event.target as HTMLElement;
    const viewBtn = target.closest('.view-btn');

    if (viewBtn) {
      const returnId = viewBtn.getAttribute('data-id');
      if (returnId) {
        this.viewReturn(parseInt(returnId));
      }
    }
  }

  viewReturn(id: number): void {
    this.router.navigate(['/sales/returns', id]);
  }

  navigateToNewReturn(): void {
    this.router.navigate(['/sales/returns/new']);
  }
}
