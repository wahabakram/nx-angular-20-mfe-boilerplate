import { Component, inject, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MEMBERSHIP_FREE_FEATURES, MEMBERSHIP_PLUS_FEATURES } from '../mock-data/membership-plans.mock';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  selector: 'app-membership-plans',
  imports: [
    MatIcon,
    MatRipple
  ],
  templateUrl: './membership-plans.html',
  styleUrl: './membership-plans.scss'
})
export class MembershipPlans {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  freeFeatures = signal(MEMBERSHIP_FREE_FEATURES);
  plusFeatures = signal(MEMBERSHIP_PLUS_FEATURES);

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
        id: 'membershipPlans',
        name: 'Membership Plans',
        type: null
      }
    ]);
  }
}
