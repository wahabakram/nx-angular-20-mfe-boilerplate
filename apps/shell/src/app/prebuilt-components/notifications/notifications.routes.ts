import { Route } from '@angular/router';

export const notificationsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./overview/overview').then(c => c.Overview)
  }
];
