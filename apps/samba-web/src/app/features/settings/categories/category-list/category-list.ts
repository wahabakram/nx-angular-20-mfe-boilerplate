import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Datatable, Panel, PanelHeader, PanelBody, BreadcrumbsStore } from '@ng-mf/components';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { CategoryActionsCell } from '../../../../_cells/category-actions-cell/category-actions-cell';
import { CategoryStatusCell } from '../../../../_cells/category-status-cell/category-status-cell';

interface Category {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  productCount: number;
}

@Component({
  selector: 'app-category-list',
  imports: [Datatable, Panel, PanelHeader, PanelBody, MatButton, Icon, RouterLink],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss'
})
export class CategoryList implements OnInit {
  private router = inject(Router);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  datatable = viewChild<Datatable<Category>>('dt');
  categories = signal<Category[]>([]);
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
        id: 'settings',
        name: 'Settings',
        route: '/settings',
        type: 'link',
      },
      {
        id: 'categories',
        name: 'Categories',
        type: null,
      },
    ]);
  }

  columns = signal<ColumnDef<Category>[]>([
    {
      header: 'Name',
      accessorKey: 'name',
      size: 200,
    },
    {
      header: 'Code',
      accessorKey: 'code',
      size: 120,
    },
    {
      header: 'Description',
      accessorKey: 'description',
      size: 300,
      cell: (info) => info.getValue() || '<span class="text-neutral-400">No description</span>',
    },
    {
      header: 'Products',
      accessorKey: 'productCount',
      size: 100,
      cell: (info) => {
        const count = info.getValue() as number;
        return `<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">${count} products</span>`;
      },
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      size: 100,
      cell: (info) => {
        return flexRenderComponent(CategoryStatusCell, {
          inputs: {
            isActive: info.getValue() as boolean,
          },
        });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'id',
      size: 120,
      enableSorting: false,
      meta: {
        pinned: 'right'
      },
      cell: (info) => {
        return flexRenderComponent(CategoryActionsCell, {
          inputs: {
            row: info.row.original,
          },
        });
      },
    },
  ]);

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    // Mock data
    setTimeout(() => {
      this.categories.set([
        {
          id: 1,
          name: 'Electronics',
          code: 'ELEC',
          description: 'Electronic devices and accessories',
          isActive: true,
          productCount: 12
        },
        {
          id: 2,
          name: 'Beverages',
          code: 'BEV',
          description: 'Drinks and beverages',
          isActive: true,
          productCount: 8
        },
        {
          id: 3,
          name: 'Snacks',
          code: 'SNACK',
          description: 'Snack foods and treats',
          isActive: true,
          productCount: 15
        },
        {
          id: 4,
          name: 'Dairy',
          code: 'DAIRY',
          description: 'Dairy products',
          isActive: true,
          productCount: 6
        },
        {
          id: 5,
          name: 'Bakery',
          code: 'BAKERY',
          description: 'Bakery items and bread',
          isActive: true,
          productCount: 5
        },
        {
          id: 6,
          name: 'Household',
          code: 'HOUSE',
          description: 'Household items and cleaning supplies',
          isActive: true,
          productCount: 7
        },
        {
          id: 7,
          name: 'Personal Care',
          code: 'CARE',
          description: 'Personal care and hygiene products',
          isActive: true,
          productCount: 4
        },
        {
          id: 8,
          name: 'Stationery',
          code: 'STAT',
          description: 'Office and school supplies',
          isActive: true,
          productCount: 3
        }
      ]);
      this.isLoading.set(false);
    }, 500);
  }

  onTableInteraction(event: any): void {
    const target = event.target as HTMLElement;
    const editBtn = target.closest('.edit-btn');
    const deleteBtn = target.closest('.delete-btn');

    if (editBtn) {
      const id = editBtn.getAttribute('data-id');
      if (id) {
        this.editCategory(parseInt(id));
      }
    } else if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-id');
      if (id) {
        this.deleteCategory(parseInt(id));
      }
    }
  }

  createCategory(): void {
    this.router.navigate(['/settings/categories/new']);
  }

  editCategory(id: number): void {
    this.router.navigate(['/settings/categories/edit', id]);
  }

  deleteCategory(id: number): void {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categories.update(cats => cats.filter(c => c.id !== id));
    }
  }

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const dt = this.datatable();
    if (dt) {
      dt.setGlobalFilter(value);
    }
  }
}
