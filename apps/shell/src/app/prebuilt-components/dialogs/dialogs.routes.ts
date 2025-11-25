import { Route } from '@angular/router';

export const dialogsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./overview/overview').then(c => c.Overview)
  }
];
