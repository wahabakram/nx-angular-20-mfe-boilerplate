import { Component, inject, input, OnInit } from '@angular/core';
import { Icon } from '@ng-mf/components';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Dashboard, DASHBOARD } from '@ng-mf/components';
import { ReturnStore } from '@samba/return-domain';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-total-returns-widget',
  imports: [Icon, MatRipple, MatTooltip, DecimalPipe],
  templateUrl: './total-returns-widget.html',
  styleUrl: './total-returns-widget.scss',
  host: {
    class: 'widget-container',
  },
})
export class TotalReturnsWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });
  private returnStore = inject(ReturnStore);

  widget = input();
  thisMonthReturns = this.returnStore.thisMonthReturns;
  totalRefundAmount = this.returnStore.thisMonthRefundAmount;

  ngOnInit() {}
}
