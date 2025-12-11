import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { Customer, CustomerApi, CustomerStore } from '@samba/customer-domain';
import {
  Datatable,
  Panel,
  PanelHeader,
  PanelBody,
  BreadcrumbsStore,
} from '@ng-mf/components';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { CustomerActionsCell } from '../../../_cells/customer-actions-cell/customer-actions-cell';
import { StatusCell } from '../../../_cells/status-cell/status-cell';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-customer-list',
  imports: [
    RouterLink,
    MatButton,
    Icon,
    Panel,
    PanelHeader,
    PanelBody,
    Datatable,
  ],
  templateUrl: './customer-list.html',
  styleUrl: './customer-list.scss',
})
export class CustomerList implements OnInit {
  private customerApi = inject(CustomerApi);
  private customerStore = inject(CustomerStore);
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private router = inject(Router);

  customers = this.customerStore.customers;
  isLoading = this.customerStore.isLoading;

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'customers',
        name: 'Customers',
        type: null,
      },
    ]);
  }

  columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'name',
      header: 'Customer Name',
      size: 200,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      size: 150,
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 200,
      cell: (info) => info.getValue() || '-',
    },
    {
      accessorKey: 'customerType',
      header: 'Type',
      size: 120,
      cell: (info) => {
        const type = info.getValue() as string;
        return type.charAt(0).toUpperCase() + type.slice(1);
      },
    },
    {
      accessorKey: 'currentBalance',
      header: 'Balance',
      size: 120,
      cell: (info) => {
        const balance = info.getValue() as number;
        const currencyPipe = new CurrencyPipe('en-US');
        return currencyPipe.transform(balance, 'USD', 'symbol', '1.2-2');
      },
    },
    {
      accessorKey: 'isActive',
      header: 'Status',
      size: 120,
      cell: (info) => {
        return flexRenderComponent(StatusCell, {
          inputs: {
            row: info.getValue() ? 'active' : 'inactive',
          },
        });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      size: 100,
      cell: (info) => {
        return flexRenderComponent(CustomerActionsCell, {
          inputs: {
            customer: info.row.original,
            onEdit: () => this.editCustomer(info.row.original),
            onDelete: () => this.deleteCustomer(info.row.original),
          },
        });
      },
    },
  ];

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerStore.setLoading(true);
    this.customerApi.getAll().subscribe({
      next: (customers) => {
        this.customerStore.setCustomers(customers);
        this.customerStore.setLoading(false);
      },
      error: (error) => {
        console.error('Error loading customers:', error);
        this.customerStore.setError('Failed to load customers');
        this.customerStore.setLoading(false);
      },
    });
  }

  editCustomer(customer: Customer): void {
    this.router.navigate(['/customers', customer.id, 'edit']);
  }

  deleteCustomer(customer: Customer): void {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      this.customerApi.delete(customer.id).subscribe({
        next: () => {
          this.customerStore.deleteCustomer(customer.id);
        },
        error: (error) => {
          console.error('Error deleting customer:', error);
          alert('Failed to delete customer');
        },
      });
    }
  }
}
