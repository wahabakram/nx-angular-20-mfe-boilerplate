import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Datatable, Panel, PanelBody, PanelHeader, BreadcrumbsStore } from '@ng-mf/components';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { QuotationActionsCell } from '../../../../_cells/quotation-actions-cell/quotation-actions-cell';

interface Quotation {
  id: number;
  quotationNumber: string;
  customerId: number;
  customerName: string;
  items: any[];
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
}

@Component({
  selector: 'app-quotation-list',
  imports: [Datatable, Panel, PanelHeader, PanelBody, MatButton, Icon],
  templateUrl: './quotation-list.html',
  styleUrl: './quotation-list.scss',
})
export class QuotationList implements OnInit {
  private router = inject(Router);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  quotations = signal<Quotation[]>([]);
  isLoading = signal(false);

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
        id: 'quotations',
        name: 'Quotations',
        type: null,
      },
    ]);
  }

  columns = signal<ColumnDef<Quotation>[]>([
    {
      header: 'Quote #',
      accessorKey: 'quotationNumber',
      size: 120,
    },
    {
      header: 'Customer',
      accessorKey: 'customerName',
      size: 200,
    },
    {
      header: 'Date',
      accessorKey: 'createdAt',
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
      header: 'Valid Until',
      accessorKey: 'validUntil',
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
      header: 'Items',
      accessorKey: 'items',
      size: 100,
      cell: (info) => {
        const items = info.getValue() as any[];
        return `${items.length} items`;
      },
    },
    {
      header: 'Total',
      accessorKey: 'totalAmount',
      size: 120,
      cell: (info) => `$${(info.getValue() as number).toFixed(2)}`,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      size: 120,
      cell: (info) => {
        const status = info.getValue() as string;
        const colorMap: Record<string, string> = {
          draft: 'bg-neutral/10 text-neutral',
          sent: 'bg-primary/10 text-primary',
          accepted: 'bg-success/10 text-success',
          rejected: 'bg-error/10 text-error',
          expired: 'bg-warning/10 text-warning',
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
        return flexRenderComponent(QuotationActionsCell, {
          inputs: {
            row: info.row.original,
          },
        });
      },
    },
  ]);

  ngOnInit(): void {
    this.loadQuotations();
  }

  loadQuotations(): void {
    // Mock data for now
    this.quotations.set([
      {
        id: 1,
        quotationNumber: 'QT-2025-001',
        customerId: 1,
        customerName: 'ABC Electronics',
        items: [{ productId: 1, quantity: 5, unitPrice: 45000 }],
        subtotal: 225000,
        taxAmount: 38250,
        totalAmount: 263250,
        validUntil: '2025-02-15',
        status: 'sent',
        createdAt: '2025-01-15',
      },
    ]);
  }

  onTableInteraction(event: any): void {
    const target = event.target as HTMLElement;
    const viewBtn = target.closest('.view-btn');
    const editBtn = target.closest('.edit-btn');

    if (viewBtn) {
      const id = viewBtn.getAttribute('data-id');
      if (id) {
        this.router.navigate(['/sales/quotations', id]);
      }
    } else if (editBtn) {
      const id = editBtn.getAttribute('data-id');
      if (id) {
        this.router.navigate(['/sales/quotations', id, 'edit']);
      }
    }
  }

  createQuotation(): void {
    this.router.navigate(['/sales/quotations/new']);
  }
}
