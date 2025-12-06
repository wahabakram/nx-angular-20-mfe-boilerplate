import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Datatable } from '@ng-mf/components';
import { ColumnDef } from '@tanstack/angular-table';
import { Page } from '../../../../_partials/page/page';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

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
  imports: [Datatable, Page, MatButton, MatIcon],
  templateUrl: './category-list.html',
  styleUrl: './category-list.scss'
})
export class CategoryList implements OnInit {
  private router = inject(Router);

  categories = signal<Category[]>([]);
  isLoading = signal(false);

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
        const isActive = info.getValue() as boolean;
        return isActive
          ? '<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">Active</span>'
          : '<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-neutral/10 text-neutral">Inactive</span>';
      },
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      size: 150,
      cell: (info) => {
        return `
          <div class="flex gap-2">
            <button class="edit-btn p-1 rounded hover:bg-surface-container" data-id="${info.getValue()}" title="Edit">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button class="delete-btn p-1 rounded hover:bg-surface-container text-error" data-id="${info.getValue()}" title="Delete">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        `;
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
}
