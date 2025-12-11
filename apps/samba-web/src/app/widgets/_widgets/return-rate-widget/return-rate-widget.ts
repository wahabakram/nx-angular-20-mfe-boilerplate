import { Component, inject, input, OnInit, computed } from '@angular/core';
import { Icon } from '@ng-mf/components';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Dashboard, DASHBOARD } from '@ng-mf/components';
import { ReturnStore } from '@samba/return-domain';
import { SaleStore } from '@samba/sale-domain';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-return-rate-widget',
  imports: [Icon, MatRipple, MatTooltip, DecimalPipe],
  templateUrl: './return-rate-widget.html',
  styleUrl: './return-rate-widget.scss',
  host: {
    class: 'widget-container',
  },
})
export class ReturnRateWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });
  private returnStore = inject(ReturnStore);
  private saleStore = inject(SaleStore);

  widget = input();

  // Calculate return rate as percentage
  returnRate = computed(() => {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const thisMonthSales = this.saleStore.sales().filter(s => {
      const saleDate = new Date(s.saleDate);
      return saleDate >= firstDayOfMonth && saleDate <= lastDayOfMonth;
    });

    const thisMonthReturns = this.returnStore.thisMonthReturns();

    if (thisMonthSales.length === 0) return 0;
    return (thisMonthReturns.length / thisMonthSales.length) * 100;
  });

  ngOnInit() {}
}
