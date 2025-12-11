import { Component, inject, input, OnInit } from '@angular/core';
import { Icon } from '@ng-mf/components';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Dashboard, DASHBOARD } from '@ng-mf/components';
import { SaleStore } from '@samba/sale-domain';

@Component({
  selector: 'app-revenue-widget',
  imports: [
    Icon,
    MatRipple,
    MatTooltip
  ],
  templateUrl: './revenue-widget.html',
  styleUrl: './revenue-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class RevenueWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });
  private saleStore = inject(SaleStore);

  widget = input();
  todayRevenue = this.saleStore.todayRevenue;

  ngOnInit() {
  }
}
