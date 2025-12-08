import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Product, ProductService, ProductStore } from '@samba/product-domain';
import { Page } from '../../../_partials/page/page';
import { Datatable, Panel, PanelHeader, PanelBody, BreadcrumbsStore } from '@ng-mf/components';
import { ColumnDef } from '@tanstack/angular-table';
import { flexRenderComponent } from '@tanstack/angular-table';
import { ProductActionsCell } from '../../../_cells/product-actions-cell/product-actions-cell';
import { StatusCell } from '../../../_cells/status-cell/status-cell';
import { StockCell } from '../../../_cells/stock-cell/stock-cell';
import { ProductImageCell } from '../../../_cells/product-image-cell/product-image-cell';

@Component({
  selector: 'app-product-list',
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
    Panel,
    PanelHeader,
    PanelBody,
    Datatable
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {
  private productService = inject(ProductService);
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
        id: 'products',
        name: 'Products',
        type: null,
      },
    ]);
  }

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
      header: 'Barcode',
      accessorKey: 'barcode',
      size: 130,
    },
    {
      header: 'Price',
      accessorKey: 'price',
      size: 120,
      cell: (info) => {
        return `$${info.getValue<number>().toFixed(2)}`;
      },
    },
    {
      header: 'Stock Level',
      accessorKey: 'stockLevel',
      size: 150,
      cell: (info) => {
        return flexRenderComponent(StockCell, {
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
      accessorKey: 'id',
      size: 130,
      enableSorting: false,
      meta: {
        pinned: 'right'
      },
      cell: (info) => {
        return flexRenderComponent(ProductActionsCell, {
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
    this.productService.getAll().subscribe({
      next: (products) => {
        this.productStore.setProducts(products);
        this.productStore.setLoading(false);
      },
      error: (error) => {
        this.productStore.setError('Failed to load products');
        this.productStore.setLoading(false);
        console.error('Error loading products:', error);
      }
    });
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    this.productStore.setFilter({ search: value });
  }

  filterByStatus(status: Product['status'] | null): void {
    this.productStore.setFilter({
      ...this.productStore.filter(),
      status: status || undefined
    });
  }

  filterLowStock(): void {
    this.productStore.setFilter({ lowStock: true });
  }
}
