import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { Product, ProductService, ProductStore } from '@samba/product-domain';

@Component({
  selector: 'app-product-actions-cell',
  imports: [
    MatIconButton,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger
  ],
  template: `
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon>more_vert</mat-icon>
    </button>
    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="editProduct()">
        <mat-icon>edit</mat-icon>
        <span>Edit</span>
      </button>
      <button mat-menu-item (click)="deleteProduct()">
        <mat-icon class="text-error">delete</mat-icon>
        <span>Delete</span>
      </button>
    </mat-menu>
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
