import { Route } from '@angular/router';

export const widgetsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./common/common').then((c) => c.Common),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'general',
      },
      {
        path: 'general',
        loadComponent: () => import('./general/general').then((c) => c.General),
        title: 'General',
      },
      {
        path: 'crypto',
        loadComponent: () => import('./crypto/crypto').then((c) => c.Crypto),
        title: 'Crypto',
      },
      {
        path: 'finance',
        loadComponent: () => import('./finance/finance').then((c) => c.Finance),
        title: 'Finance',
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./analytics/analytics').then((c) => c.Analytics),
        title: 'Analytics',
      },
    ],
  },
];
