import { Route } from '@angular/router';

export const accountRoutes: Route[] = [
  {
    path: 'notifications',
    loadComponent: () =>
      import('./notifications/notifications').then((c) => c.Notifications),
    title: 'Notifications',
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.routes').then((m) => m.settingsRoutes),
  },
];
