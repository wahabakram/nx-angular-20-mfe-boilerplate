import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Dashboard, DASHBOARD } from '@ng-mf/components';
import { SaleStore } from '@samba/sale-domain';

@Component({
  selector: 'app-total-sales-widget',
  imports: [
    MatIcon,
    MatRipple,
    MatTooltip
  ],
  templateUrl: './total-sales-widget.html',
  styleUrl: './total-sales-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class TotalSalesWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });
  private saleStore = inject(SaleStore);

  widget = input();
  todaySales = this.saleStore.todaySales;

  ngOnInit() {
  }
}
