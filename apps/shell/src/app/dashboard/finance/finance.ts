import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Icon } from '@ng-mf/components';
import { MatRipple } from '@angular/material/core';
import {
  Transaction,
  TransactionsWidget
} from '@/widgets/_widgets/transactions-widget/transactions-widget';
import { ExchangeWidget } from '@/widgets/_widgets/exchange-widget/exchange-widget';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [
    DecimalPipe,
    MatButton,
    MatIcon,
    Icon,
    MatRipple,
    TransactionsWidget,
    ExchangeWidget
  ],
  templateUrl: './finance.html',
  styleUrl: './finance.scss'
})
export class Finance {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  totalBalance = 2136;
  currencyCode = 'usd';
  transactions: Transaction[] = [
    {
      createdAt: '14 Feb',
      status: 'approved',
      to: {
        amount: 129.81,
        currency: 'GPB'
      },
      from: {
        amount: 50,
        currency: 'USD'
      },
      sender: {
        id: 1,
        name: 'Pavel Salauyou'
      },
      recipient: {
        id: 1,
        name: 'Pavel Salauyou'
      }
    },
    {
      createdAt: '14 Feb',
      status: 'cancelled',
      to: {
        amount: 129.81,
        currency: 'GPB'
      },
      from: {
        amount: 50,
        currency: 'USD'
      },
      sender: {
        id: 1,
        name: 'Pavel Salauyou'
      },
      recipient: {
        id: 1,
        name: 'Pavel Salauyou'
      }
    },
    {
      createdAt: '12 Feb',
      status: 'cancelled',
      to: {
        amount: 100.02,
        currency: 'GPB'
      },
      from: {
        amount: 44,
        currency: 'USD'
      },
      sender: {
        id: 1,
        name: 'Pavel Salauyou'
      },
      recipient: {
        id: 1,
        name: 'Pavel Salauyou'
      }
    },
    {
      createdAt: '12 Feb',
      status: 'approved',
      to: {
        amount: 155.81,
        currency: 'GPB'
      },
      from: {
        amount: 55,
        currency: 'USD'
      },
      sender: {
        id: 1,
        name: 'Pavel Salauyou'
      },
      recipient: {
        id: 1,
        name: 'Pavel Salauyou'
      }
    },
  ];

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'finance',
        name: 'Finance',
        type: null
      }
    ]);
  }
}
