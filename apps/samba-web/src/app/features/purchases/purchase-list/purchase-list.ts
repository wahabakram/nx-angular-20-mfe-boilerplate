import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { Purchase, PurchaseApi, PurchaseStore } from '@samba/purchase-domain';
import {
  Datatable,
  Panel,
  PanelHeader,
  PanelBody,
  BreadcrumbsStore,
} from '@ng-mf/components';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { PurchaseActionsCell } from '../../../_cells/purchase-actions-cell/purchase-actions-cell';
import { StatusCell } from '../../../_cells/status-cell/status-cell';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-purchase-list',
  imports: [
    RouterLink,
    MatButton,
    Icon,
    Panel,
    PanelHeader,
    PanelBody,
    Datatable,
  ],
  templateUrl: './purchase-list.html',
  styleUrl: './purchase-list.scss',
})
export class PurchaseList implements OnInit {
  private purchaseApi = inject(PurchaseApi);
  private purchaseStore = inject(PurchaseStore);
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private router = inject(Router);

  purchases = this.purchaseStore.purchases;
  isLoading = this.purchaseStore.isLoading;

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'purchases',
        name: 'Purchase Orders',
        type: null,
      },
    ]);
  }

  columns: ColumnDef<Purchase>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
      cell: (info) => `#${info.getValue()}`,
    },
    {
      accessorKey: 'purchaseNumber',
      header: 'PO Number',
      size: 150,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'supplier',
      header: 'Supplier',
      size: 200,
      cell: (info) => {
        const supplier = info.getValue() as any;
        return supplier?.name || '-';
      },
    },
    {
      accessorKey: 'purchaseDate',
      header: 'Purchase Date',
      size: 120,
      cell: (info) => {
        const date = info.getValue() as Date;
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, 'MMM d, yyyy');
      },
    },
    {
      accessorKey: 'expectedDeliveryDate',
      header: 'Expected Delivery',
      size: 140,
      cell: (info) => {
        const date = info.getValue() as Date;
        if (!date) return '-';
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(date, 'MMM d, yyyy');
      },
    },
    {
      accessorKey: 'total',
      header: 'Total',
      size: 120,
      cell: (info) => {
        const total = info.getValue() as number;
        const currencyPipe = new CurrencyPipe('en-US');
        return currencyPipe.transform(total, 'USD', 'symbol', '1.2-2');
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 120,
      cell: (info) => {
        const status = info.getValue() as string;
        return flexRenderComponent(StatusCell, {
          inputs: {
            row: status,
          },
        });
      },
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      size: 120,
      cell: (info) => {
        const paymentStatus = info.getValue() as string;
        const colorMap: Record<string, string> = {
          paid: 'bg-success/10 text-success',
          partial: 'bg-warning/10 text-warning',
          pending: 'bg-neutral/10 text-neutral',
        };
        const colorClass = colorMap[paymentStatus] || 'bg-neutral/10 text-neutral';
        return `<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium ${colorClass}">${paymentStatus}</span>`;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 100,
      cell: (info) => {
        return flexRenderComponent(PurchaseActionsCell, {
          inputs: {
            purchase: info.row.original,
            onView: () => this.viewPurchase(info.row.original),
            onReceive: () => this.receivePurchase(info.row.original),
            onDelete: () => this.deletePurchase(info.row.original),
          },
        });
      },
    },
  ];

  ngOnInit(): void {
    this.loadPurchases();
  }

  loadPurchases(): void {
    this.purchaseStore.setLoading(true);
    this.purchaseApi.getAll().subscribe({
      next: (purchases) => {
        this.purchaseStore.setPurchases(purchases);
        this.purchaseStore.setLoading(false);
      },
      error: (error) => {
        console.error('Error loading purchases:', error);
        this.purchaseStore.setError('Failed to load purchases');
        this.purchaseStore.setLoading(false);
      },
    });
  }

  viewPurchase(purchase: Purchase): void {
    this.router.navigate(['/purchases', purchase.id]);
  }

  receivePurchase(purchase: Purchase): void {
    this.router.navigate(['/purchases', purchase.id, 'receive']);
  }

  deletePurchase(purchase: Purchase): void {
    if (confirm(`Are you sure you want to delete purchase order ${purchase.purchaseNumber}?`)) {
      this.purchaseApi.delete(purchase.id).subscribe({
        next: () => {
          this.purchaseStore.removePurchase(purchase.id);
        },
        error: (error) => {
          console.error('Error deleting purchase:', error);
          alert('Failed to delete purchase order');
        },
      });
    }
  }
}
