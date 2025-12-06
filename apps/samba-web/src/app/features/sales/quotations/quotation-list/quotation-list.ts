import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Datatable } from '@ng-mf/components';
import { ColumnDef } from '@tanstack/angular-table';
import { Page } from '../../../../_partials/page/page';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

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
  imports: [Datatable, Page, MatButton, MatIcon],
  templateUrl: './quotation-list.html',
  styleUrl: './quotation-list.scss'
})
export class QuotationList implements OnInit {
  private router = inject(Router);

  quotations = signal<Quotation[]>([]);
  isLoading = signal(false);

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
          day: 'numeric'
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
          day: 'numeric'
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
          expired: 'bg-warning/10 text-warning'
        };
        const color = colorMap[status] || 'bg-neutral/10 text-neutral';
        return `<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium ${color}">${status}</span>`;
      },
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      size: 150,
      cell: (info) => {
        return `
          <div class="flex gap-2">
            <button class="view-btn p-1 rounded hover:bg-surface-container" data-id="${info.getValue()}" title="View">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
              </svg>
            </button>
            <button class="edit-btn p-1 rounded hover:bg-surface-container" data-id="${info.getValue()}" title="Edit">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
          </div>
        `;
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
        items: [
          { productId: 1, quantity: 5, unitPrice: 45000 }
        ],
        subtotal: 225000,
        taxAmount: 38250,
        totalAmount: 263250,
        validUntil: '2025-02-15',
        status: 'sent',
        createdAt: '2025-01-15'
      }
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
