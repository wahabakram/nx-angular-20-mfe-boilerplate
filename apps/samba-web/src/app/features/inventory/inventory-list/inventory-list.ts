import { Component, inject, OnInit, signal } from '@angular/core';
import { Icon } from '@ng-mf/components';
import { MatBadge } from '@angular/material/badge';
import { MatButton } from '@angular/material/button';
import { Product, ProductApi, ProductStore } from '@samba/product-domain';
import {
  Datatable,
  Panel,
  PanelHeader,
  PanelBody,
  BreadcrumbsStore,
} from '@ng-mf/components';
import { ColumnDef } from '@tanstack/angular-table';
import { flexRenderComponent } from '@tanstack/angular-table';
import { StatusCell } from '../../../_cells/status-cell/status-cell';
import { InventoryStockCell } from '../../../_cells/inventory-stock-cell/inventory-stock-cell';
import { InventoryActionsCell } from '../../../_cells/inventory-actions-cell/inventory-actions-cell';
import { ProductImageCell } from '../../../_cells/product-image-cell/product-image-cell';

@Component({
  selector: 'app-inventory-list',
  imports: [
    Icon,
    MatBadge,
    MatButton,
    Panel,
    PanelHeader,
    PanelBody,
    Datatable,
  ],
  templateUrl: './inventory-list.html',
  styleUrl: './inventory-list.scss',
})
export class InventoryList implements OnInit {
  private productApi = inject(ProductApi);
  private productStore = inject(ProductStore);
  private breadcrumbsStore = inject(BreadcrumbsStore);
  products = this.productStore.filteredProducts;
  isLoading = this.productStore.isLoading;
  searchTerm = signal('');

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'inventory',
        name: 'Inventory',
        type: null,
      },
    ]);
  }

  lowStockCount = this.productStore.lowStockProducts;

  columns = signal<ColumnDef<Product>[]>([
    {
      header: 'Product',
      accessorKey: 'name',
      size: 300,
      cell: (info) => {
        return flexRenderComponent(ProductImageCell, {
          inputs: {
            row: info.row.original,
          },
        });
      },
    },
    {
      header: 'SKU',
      accessorKey: 'sku',
      size: 120,
    },
    {
      header: 'Stock Level',
      accessorKey: 'stockLevel',
      size: 250,
      cell: (info) => {
        return flexRenderComponent(InventoryStockCell, {
          inputs: {
            row: info.row.original,
          },
        });
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      size: 130,
      cell: (info) => {
        return flexRenderComponent(StatusCell, {
          inputs: {
            row: info.getValue<string>(),
          },
        });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'actions',
      size: 180,
      enableSorting: false,
      meta: {
        pinned: 'right',
      },
      cell: (info) => {
        return flexRenderComponent(InventoryActionsCell, {
          inputs: {
            row: info.row.original,
          },
        });
      },
    },
  ]);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productStore.setLoading(true);
    this.productApi.getAll().subscribe({
      next: (products) => {
        this.productStore.setProducts(products);
        this.productStore.setLoading(false);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.productStore.setLoading(false);
      },
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.productStore.setFilter({ search: value });
  }

  filterLowStock(): void {
    this.productStore.setFilter({ lowStock: true });
  }

  filterByStatus(status: Product['status'] | null): void {
    this.productStore.setFilter({
      ...this.productStore.filter(),
      status: status || undefined,
      lowStock: undefined,
    });
  }

  clearFilters(): void {
    this.searchTerm.set('');
    this.productStore.clearFilter();
  }
}
