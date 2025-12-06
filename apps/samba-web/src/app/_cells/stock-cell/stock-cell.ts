import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Product } from '@samba/product-domain';

@Component({
  selector: 'app-stock-cell',
  imports: [MatIcon],
  template: `
    <div class="flex items-center gap-2">
      <span
        [class.text-error]="isLowStock()"
        [class.text-success]="isHighStock()"
        [class.font-semibold]="isLowStock() || isHighStock()">
        {{ row().stockLevel }} {{ row().unit }}
      </span>
      @if (isLowStock()) {
        <mat-icon class="text-error !text-base">warning</mat-icon>
      }
    </div>
  `,
})
export class StockCell {
  row = input.required<Product>();

  isLowStock(): boolean {
    const product = this.row();
    return product.stockLevel <= product.lowStockThreshold;
  }

  isHighStock(): boolean {
    const product = this.row();
    return product.stockLevel >= product.maxStockLevel * 0.8;
  }
}
