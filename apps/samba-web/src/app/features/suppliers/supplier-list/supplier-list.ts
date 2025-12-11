import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { Supplier, SupplierApi, SupplierStore } from '@samba/supplier-domain';
import {
  Datatable,
  Panel,
  PanelHeader,
  PanelBody,
  BreadcrumbsStore,
} from '@ng-mf/components';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { SupplierActionsCell } from '../../../_cells/supplier-actions-cell/supplier-actions-cell';
import { StatusCell } from '../../../_cells/status-cell/status-cell';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-supplier-list',
  imports: [
    RouterLink,
    MatButton,
    Icon,
    Panel,
    PanelHeader,
    PanelBody,
    Datatable,
  ],
  templateUrl: './supplier-list.html',
  styleUrl: './supplier-list.scss',
})
export class SupplierList implements OnInit {
  private supplierApi = inject(SupplierApi);
  private supplierStore = inject(SupplierStore);
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private router = inject(Router);

  suppliers = this.supplierStore.suppliers;
  isLoading = this.supplierStore.isLoading;

  constructor() {
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
        type: null,
      },
    ]);
  }

  columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'name',
      header: 'Supplier Name',
      size: 180,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'companyName',
      header: 'Company',
      size: 180,
      cell: (info) => info.getValue() || '-',
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      size: 140,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 180,
      cell: (info) => info.getValue() || '-',
    },
    {
      accessorKey: 'currentBalance',
      header: 'Payable',
      size: 120,
      cell: (info) => {
        const balance = info.getValue() as number;
        const currencyPipe = new CurrencyPipe('en-US');
        return currencyPipe.transform(balance, 'USD', 'symbol', '1.2-2');
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 120,
      cell: (info) => {
        return flexRenderComponent(StatusCell, {
          inputs: {
            row: info.getValue() as string,
          },
        });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 100,
      cell: (info) => {
        return flexRenderComponent(SupplierActionsCell, {
          inputs: {
            supplier: info.row.original,
            onEdit: () => this.editSupplier(info.row.original),
            onDelete: () => this.deleteSupplier(info.row.original),
          },
        });
      },
    },
  ];

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierStore.setLoading(true);
    this.supplierApi.getAll().subscribe({
      next: (suppliers) => {
        this.supplierStore.setSuppliers(suppliers);
        this.supplierStore.setLoading(false);
      },
      error: (error) => {
        console.error('Error loading suppliers:', error);
        this.supplierStore.setError('Failed to load suppliers');
        this.supplierStore.setLoading(false);
      },
    });
  }

  editSupplier(supplier: Supplier): void {
    this.router.navigate(['/suppliers', supplier.id, 'edit']);
  }

  deleteSupplier(supplier: Supplier): void {
    if (confirm(`Are you sure you want to delete ${supplier.name}?`)) {
      this.supplierApi.delete(supplier.id).subscribe({
        next: () => {
          this.supplierStore.removeSupplier(supplier.id);
        },
        error: (error) => {
          console.error('Error deleting supplier:', error);
          alert('Failed to delete supplier');
        },
      });
    }
  }
}
