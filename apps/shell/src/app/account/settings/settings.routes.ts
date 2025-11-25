import { Route } from '@angular/router';

export const settingsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./common/common').then((c) => c.Common),
    children: [
      {
        path: 'my-profile',
        title: 'My Profile',
        loadComponent: () =>
          import('./my-profile/my-profile').then((c) => c.MyProfile),
      },
      {
        path: 'security',
        title: 'Security',
        loadComponent: () =>
          import('./security/security').then((c) => c.Security),
      },
      {
        path: 'notifications',
        title: 'Notifications',
        loadComponent: () =>
          import('./notifications/notifications').then((c) => c.Notifications),
      },
      {
        path: 'notifications-2',
        title: 'Notifications 2',
        loadComponent: () =>
          import('./notifications-2/notifications-2').then(
            (c) => c.Notifications2
          ),
      },
      {
        path: 'billing',
        title: 'Billing',
        loadComponent: () => import('./billing/billing').then((c) => c.Billing),
      },
      {
        path: 'billing-2',
        title: 'Billing 2',
        loadComponent: () =>
          import('./billing-2/billing-2').then((c) => c.Billing2),
      },
      {
        path: 'sessions',
        title: 'Sessions',
        loadComponent: () =>
          import('./sessions/sessions').then((c) => c.Sessions),
      },
      {
        path: 'cookie',
        title: 'Cookie',
        loadComponent: () => import('./cookie/cookie').then((c) => c.Cookie),
      },
      {
        path: 'payment',
        title: 'Payment',
        loadComponent: () => import('./payment/payment').then((c) => c.Payment),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'my-profile',
      },
    ],
  },
];
