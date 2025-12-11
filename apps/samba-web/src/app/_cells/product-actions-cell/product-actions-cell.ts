import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { Product, ProductApi, ProductStore } from '@samba/product-domain';
import { Icon } from '@ng-mf/components';

@Component({
  selector: 'app-product-actions-cell',
  imports: [MatIconButton, Icon],
  template: `
    <div class="flex gap-1">
      <button mat-icon-button (click)="editProduct()" matTooltip="Edit">
        <mf-icon
          name="solar:pen-line-duotone"
          class="text-blue-600 dark:text-blue-400"
        />
      </button>
      <button mat-icon-button (click)="viewProduct()" matTooltip="View">
        <mf-icon name="solar:eye-line-duotone" />
      </button>
      <button
        mat-icon-button
        (click)="deleteProduct()"
        matTooltip="Delete"
        class="text-error"
      >
        <mf-icon
          name="solar:trash-bin-minimalistic-line-duotone"
          class="text-error dark:text-red-400"
        />
      </button>
    </div>
  `,
})
export class ProductActionsCell {
  private router = inject(Router);
  private productApi = inject(ProductApi);
  private productStore = inject(ProductStore);

  row = input.required<Product>();

  editProduct(): void {
    this.router.navigate(['/products/edit', this.row().id]);
  }

  viewProduct(): void {
    this.router.navigate(['/products', this.row().id]);
  }

  deleteProduct(): void {
    const product = this.row();
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.productApi.delete(product.id).subscribe({
        next: () => {
          this.productStore.deleteProduct(product.id);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product');
        },
      });
    }
  }
}
