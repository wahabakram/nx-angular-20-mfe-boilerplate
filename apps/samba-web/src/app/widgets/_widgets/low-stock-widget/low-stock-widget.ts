import { Component, inject, input, OnInit } from '@angular/core';
import { Icon } from '@ng-mf/components';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Dashboard, DASHBOARD } from '@ng-mf/components';
import { ProductStore } from '@samba/product-domain';

@Component({
  selector: 'app-low-stock-widget',
  imports: [
    Icon,
    MatRipple,
    MatTooltip
  ],
  templateUrl: './low-stock-widget.html',
  styleUrl: './low-stock-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class LowStockWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });
  private productStore = inject(ProductStore);

  widget = input();
  lowStockProducts = this.productStore.lowStockProducts;

  ngOnInit() {
  }
}
