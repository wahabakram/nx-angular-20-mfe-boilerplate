import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Product } from '@samba/product-domain';

@Component({
  selector: 'app-inventory-stock-cell',
  imports: [MatIcon],
  template: `
    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <span
          class="text-sm font-semibold"
          [class.text-error]="getStockStatus() === 'low'"
          [class.text-success]="getStockStatus() === 'high'"
          [class.text-neutral-900]="getStockStatus() === 'normal'">
          {{ row().stockLevel }} {{ row().unit }}
        </span>
        @if (getStockStatus() === 'low') {
          <mat-icon class="text-error text-sm">warning</mat-icon>
        }
      </div>
      <div class="w-full bg-neutral-200 rounded-full h-2">
        <div
          class="h-2 rounded-full transition-all"
          [class.bg-error]="getStockStatus() === 'low'"
          [class.bg-success]="getStockStatus() === 'high'"
          [class.bg-primary]="getStockStatus() === 'normal'"
          [style.width.%]="getStockPercentage()"></div>
      </div>
      <div class="text-xs text-neutral-500">
        Max: {{ row().maxStockLevel }} | Min: {{ row().lowStockThreshold }}
      </div>
    </div>
  `,
})
export class InventoryStockCell {
  row = input.required<Product>();

  getStockStatus(): 'low' | 'normal' | 'high' {
    const product = this.row();
    if (product.stockLevel <= product.lowStockThreshold) {
      return 'low';
    } else if (product.stockLevel >= product.maxStockLevel * 0.8) {
      return 'high';
    }
    return 'normal';
  }

  getStockPercentage(): number {
    const product = this.row();
    return (product.stockLevel / product.maxStockLevel) * 100;
  }
}
