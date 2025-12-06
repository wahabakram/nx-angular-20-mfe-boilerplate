import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { Dashboard, DASHBOARD } from '@ng-mf/components';
import { SaleStore } from '@samba/sale-domain';

@Component({
  selector: 'app-recent-sales-widget',
  imports: [
    MatIcon,
    MatTooltip,
    DatePipe
  ],
  templateUrl: './recent-sales-widget.html',
  styleUrl: './recent-sales-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class RecentSalesWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });
  private saleStore = inject(SaleStore);

  widget = input();
  todaySales = this.saleStore.todaySales;

  ngOnInit() {
  }
}
