import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Datatable, Panel, PanelHeader, PanelBody, BreadcrumbsStore } from '@ng-mf/components';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { StatusCell } from '../../../_cells/status-cell/status-cell';
import { TransferActionsCell } from '../../../_cells/transfer-actions-cell/transfer-actions-cell';

interface StockTransfer {
  id: number;
  transferNumber: string;
  fromBranchId: number;
  fromBranchName: string;
  toBranchId: number;
  toBranchName: string;
  productId: number;
  productName: string;
  quantity: number;
  status: 'pending' | 'approved' | 'in-transit' | 'completed' | 'rejected';
  requestedBy: number;
  requestedByName: string;
  approvedBy?: number;
  approvedByName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

@Component({
  selector: 'app-transfer-list',
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
    Panel,
    PanelHeader,
    PanelBody,
    Datatable,
    DatePipe,
    TitleCasePipe,
  ],
  templateUrl: './transfer-list.html',
  styleUrl: './transfer-list.scss'
})
export class TransferList implements OnInit {
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private router = inject(Router);

  transfers = signal<StockTransfer[]>([]);
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
        id: 'stock-transfers',
        name: 'Stock Transfers',
        type: null,
      },
    ]);
  }

  columns = signal<ColumnDef<StockTransfer>[]>([
    {
      accessorKey: 'transferNumber',
      header: 'Transfer #',
      size: 150,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'productName',
      header: 'Product',
      size: 200,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      size: 100,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'fromBranchName',
      header: 'From Branch',
      size: 150,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'toBranchName',
      header: 'To Branch',
      size: 150,
      cell: (info) => info.getValue(),
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
      accessorKey: 'requestedByName',
      header: 'Requested By',
      size: 150,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      size: 120,
      cell: (info) => {
        const date = new Date(info.getValue() as string);
        return date.toLocaleDateString();
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'id',
      size: 150,
      enableSorting: false,
      meta: {
        pinned: 'right'
      },
      cell: (info) => {
        return flexRenderComponent(TransferActionsCell, {
          inputs: {
            row: info.row.original,
          },
          outputs: {
            onView: (id: number) => this.viewTransfer(id),
            onApprove: (id: number) => this.approveTransfer(id),
            onReject: (id: number) => this.rejectTransfer(id),
          },
        });
      },
    },
  ]);

  ngOnInit(): void {
    this.loadTransfers();
  }

  loadTransfers(): void {
    this.isLoading.set(true);
    
    // Mock data - replace with actual API call
    setTimeout(() => {
      const mockTransfers: StockTransfer[] = [
        {
          id: 1,
          transferNumber: 'TRF-20240101-001',
          fromBranchId: 1,
          fromBranchName: 'Main Branch (HQ)',
          toBranchId: 2,
          toBranchName: 'North Branch',
          productId: 1,
          productName: 'LED TV 55 inch Samsung',
          quantity: 5,
          status: 'pending',
          requestedBy: 2,
          requestedByName: 'Branch Manager',
          notes: 'Urgent - customer waiting',
          createdAt: '2024-12-01T10:00:00.000Z',
          updatedAt: '2024-12-01T10:00:00.000Z',
        },
        {
          id: 2,
          transferNumber: 'TRF-20240102-002',
          fromBranchId: 1,
          fromBranchName: 'Main Branch (HQ)',
          toBranchId: 3,
          toBranchName: 'South Branch',
          productId: 2,
          productName: 'Washing Machine 7kg LG',
          quantity: 3,
          status: 'approved',
          requestedBy: 2,
          requestedByName: 'Branch Manager',
          approvedBy: 1,
          approvedByName: 'System Administrator',
          notes: 'Approved for transfer',
          createdAt: '2024-12-02T09:00:00.000Z',
          updatedAt: '2024-12-02T11:00:00.000Z',
        },
        {
          id: 3,
          transferNumber: 'TRF-20240103-003',
          fromBranchId: 2,
          fromBranchName: 'North Branch',
          toBranchId: 1,
          toBranchName: 'Main Branch (HQ)',
          productId: 4,
          productName: 'Microwave Oven 20L',
          quantity: 2,
          status: 'completed',
          requestedBy: 1,
          requestedByName: 'System Administrator',
          approvedBy: 2,
          approvedByName: 'Branch Manager',
          notes: 'Transfer completed successfully',
          createdAt: '2024-12-03T08:00:00.000Z',
          updatedAt: '2024-12-03T15:00:00.000Z',
        },
      ];

      this.transfers.set(mockTransfers);
      this.isLoading.set(false);
    }, 500);
  }

  viewTransfer(id: number): void {
    this.router.navigate(['/stock-transfers', id, 'view']);
  }

  approveTransfer(id: number): void {
    if (confirm('Are you sure you want to approve this transfer?')) {
      console.log('Approving transfer:', id);
      // Implement approval logic
      this.loadTransfers();
    }
  }

  rejectTransfer(id: number): void {
    if (confirm('Are you sure you want to reject this transfer?')) {
      console.log('Rejecting transfer:', id);
      // Implement rejection logic
      this.loadTransfers();
    }
  }
}
