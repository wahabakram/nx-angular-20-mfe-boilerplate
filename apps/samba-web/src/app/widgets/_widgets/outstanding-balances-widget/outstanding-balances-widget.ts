import { Component, inject, input, OnInit, computed } from '@angular/core';
import { Icon } from '@ng-mf/components';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Dashboard, DASHBOARD } from '@ng-mf/components';
import { LedgerStore } from '@samba/ledger-domain';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-outstanding-balances-widget',
  imports: [Icon, MatRipple, MatTooltip, DecimalPipe],
  templateUrl: './outstanding-balances-widget.html',
  styleUrl: './outstanding-balances-widget.scss',
  host: {
    class: 'widget-container',
  },
})
export class OutstandingBalancesWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });
  private ledgerStore = inject(LedgerStore);

  widget = input();
  customersWithBalance = this.ledgerStore.customersWithBalance;

  totalOutstanding = computed(() => {
    const summaries = this.ledgerStore.customersWithBalance();
    return summaries.reduce((sum, s) => sum + s.currentBalance, 0);
  });

  ngOnInit() {}
}
