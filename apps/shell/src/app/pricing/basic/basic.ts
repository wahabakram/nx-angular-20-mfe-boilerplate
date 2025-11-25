import { Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { DecimalPipe } from '@angular/common';
import { BASIC_PRICING_PLANS } from '../mock-data/basic.mock';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [
    MatIcon,
    MatButton,
    DecimalPipe
  ],
  templateUrl: './basic.html',
  styleUrl: './basic.scss'
})
export class Basic {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  paymentType = signal<'monthly' | 'annual'>('monthly');
  pricingPlans = signal(BASIC_PRICING_PLANS);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'home',
        name: 'Pricing',
        route: '/pricing/basic',
        type: 'link',
      },
      {
        id: 'basic',
        name: 'Basic',
        type: null
      }
    ]);
  }

  payMonthly(): void {
    this.paymentType.set('monthly');
  }

  payAnnual(): void {
    this.paymentType.set('annual');
  }
}
