import { Route } from '@angular/router';

export const sidebarRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./overview/overview').then(c => c.Overview)
  }
];
