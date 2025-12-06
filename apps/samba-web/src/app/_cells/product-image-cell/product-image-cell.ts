import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Product } from '@samba/product-domain';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-product-image-cell',
  imports: [MatIcon, NgOptimizedImage],
  template: `
    <div class="flex items-center gap-3">
      <div class="size-20 rounded-lg overflow-hidden bg-surface-container flex items-center justify-center flex-shrink-0">
        @if (row().imageUrl) {
          <img
            [ngSrc]="row().imageUrl ?? ''"
            [alt]="row().name"
            width="48"
            height="48"
            class="w-full h-full object-cover"
          />
        } @else {
          <mat-icon class="text-neutral-400">inventory_2</mat-icon>
        }
      </div>
      <div class="flex flex-col min-w-0">
        <div class="text-sm font-medium text-neutral-900 truncate">{{ row().name }}</div>
        @if (row().description) {
          <div class="text-xs text-neutral-500 truncate">{{ row().description }}</div>
        }
      </div>
    </div>
  `,
})
export class ProductImageCell {
  row = input.required<Product>();
}
