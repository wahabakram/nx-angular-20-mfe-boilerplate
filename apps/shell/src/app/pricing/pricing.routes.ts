import { Route } from '@angular/router';

export const pricingRoutes: Route[] = [
  {
    path: 'basic',
    title: 'Basic Pricing',
    loadComponent: () => import('./basic/basic').then(c => c.Basic)
  },
  {
    path: 'membership-plans',
    title: 'Membership plans',
    loadComponent: () => import('./membership-plans/membership-plans').then(c => c.MembershipPlans)
  }
];
