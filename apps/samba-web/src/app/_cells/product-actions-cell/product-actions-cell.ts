import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Product, ProductService, ProductStore } from '@samba/product-domain';

@Component({
  selector: 'app-product-actions-cell',
  imports: [
    MatIconButton,
    MatIcon
  ],
  template: `
    <div class="flex gap-1">
      <button mat-icon-button (click)="editProduct()" matTooltip="Edit">
        <mat-icon>edit</mat-icon>
      </button>
      <button mat-icon-button (click)="viewProduct()" matTooltip="View">
        <mat-icon>visibility</mat-icon>
      </button>
      <button mat-icon-button (click)="deleteProduct()" matTooltip="Delete" class="text-error">
        <mat-icon>delete</mat-icon>
      </button>
    </div>
  `,
})
export class ProductActionsCell {
  private router = inject(Router);
  private productService = inject(ProductService);
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
      this.productService.delete(product.id).subscribe({
        next: () => {
          this.productStore.deleteProduct(product.id);
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          alert('Failed to delete product');
        }
      });
    }
  }
}
