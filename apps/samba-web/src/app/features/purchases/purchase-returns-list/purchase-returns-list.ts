import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PurchaseApi, PurchaseReturn } from '@samba/purchase-domain';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { Datatable } from '@ng-mf/components';
import { ColumnDef } from '@tanstack/angular-table';
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { BreadcrumbsStore } from '@ng-mf/components';
import { Page } from '../../../_partials/page/page';

@Component({
  selector: 'app-purchase-returns-list',
  standalone: true,
  imports: [
    MatButton,
    Icon,
    Datatable,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
    Page,
  ],
  templateUrl: './purchase-returns-list.html',
  styleUrl: './purchase-returns-list.scss'
})
export class PurchaseReturnsList implements OnInit {
  private router = inject(Router);
  private purchaseApi = inject(PurchaseApi);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  returns = signal<PurchaseReturn[]>([]);
  isLoading = signal(false);

  columns: ColumnDef<PurchaseReturn>[] = [
    {
      header: 'Return #',
      accessorKey: 'returnNumber',
      cell: (info) => info.getValue(),
    },
    {
      header: 'Return Date',
      accessorKey: 'returnDate',
      cell: (info) => {
        const date = info.getValue() as Date;
        return new DatePipe('en-US').transform(date, 'MMM d, yyyy');
      },
    },
    {
      header: 'Purchase #',
      accessorKey: 'purchase',
      cell: (info) => {
        const purchase = info.getValue() as any;
        return purchase?.purchaseNumber || '-';
      },
    },
    {
      header: 'Supplier',
      accessorKey: 'supplier',
      cell: (info) => {
        const supplier = info.getValue() as any;
        return supplier?.name || '-';
      },
    },
    {
      header: 'Items',
      accessorKey: 'items',
      cell: (info) => {
        const items = info.getValue() as any[];
        return items?.length || 0;
      },
    },
    {
      header: 'Return Amount',
      accessorKey: 'total',
      cell: (info) => {
        const value = info.getValue() as number;
        return new CurrencyPipe('en-US').transform(value, 'PKR ');
      },
    },
    {
      header: 'Refund Method',
      accessorKey: 'refundMethod',
      cell: (info) => {
        const value = info.getValue() as string;
        return new TitleCasePipe().transform(value);
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (info) => {
        const status = info.getValue() as string;
        const colorMap: Record<string, string> = {
          pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          processed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        };
        const color = colorMap[status] || 'bg-neutral-100 text-neutral-800';
        return `<span class="px-2 py-1 rounded-full text-xs font-medium ${color}">${new TitleCasePipe().transform(status)}</span>`;
      },
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      cell: (info) => {
        const id = info.getValue() as number;
        return `<button class="view-btn" data-id="${id}">View</button>`;
      },
    },
  ];

  ngOnInit(): void {
    this.loadReturns();
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'purchases',
        name: 'Purchases',
        route: '/purchases',
        type: 'link',
      },
      {
        id: 'returns',
        name: 'Returns',
        type: null,
      },
    ]);
  }

  loadReturns(): void {
    this.isLoading.set(true);
    this.purchaseApi.getAllReturns().subscribe({
      next: (returns) => {
        this.returns.set(returns);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load purchase returns:', err);
        this.isLoading.set(false);
      }
    });
  }

  onRowClick(returnRecord: PurchaseReturn): void {
    // Navigate to return detail page (to be created)
    console.log('View return:', returnRecord.id);
  }

  createReturn(): void {
    // Navigate to purchases list to select a purchase
    this.router.navigate(['/purchases']);
  }
}
