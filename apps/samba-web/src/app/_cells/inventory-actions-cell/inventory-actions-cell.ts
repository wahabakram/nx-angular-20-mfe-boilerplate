import { Component, inject, input } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Product, ProductService, ProductStore } from '@samba/product-domain';

@Component({
  selector: 'app-inventory-actions-cell',
  imports: [MatMiniFabButton, MatIcon, MatTooltip],
  template: `
    <div class="flex gap-2">
      <button
        mat-mini-fab
        color="accent"
        (click)="adjustStock(-1)"
        [disabled]="row().stockLevel <= 0"
        matTooltip="Remove 1">
        <mat-icon>remove</mat-icon>
      </button>
      <button
        mat-mini-fab
        color="primary"
        (click)="adjustStock(1)"
        matTooltip="Add 1">
        <mat-icon>add</mat-icon>
      </button>
      <button
        mat-mini-fab
        (click)="adjustStock(10)"
        matTooltip="Add 10">
        <mat-icon>add_circle</mat-icon>
      </button>
    </div>
  `,
})
export class InventoryActionsCell {
  private productService = inject(ProductService);
  private productStore = inject(ProductStore);

  row = input.required<Product>();

  adjustStock(adjustment: number): void {
    const product = this.row();
    const newStock = product.stockLevel + adjustment;

    if (newStock < 0) {
      alert('Stock cannot be negative');
      return;
    }

    // Update locally
    this.productStore.updateStock(product.id, adjustment);

    // Update on server
    this.productService
      .update({
        id: product.id,
        stockLevel: newStock,
      })
      .subscribe({
        next: () => {
          console.log('Stock updated successfully');
        },
        error: (err) => {
          console.error('Failed to update stock:', err);
          // Revert on error
          this.productStore.updateStock(product.id, -adjustment);
          alert('Failed to update stock');
        },
      });
  }
}
