import { Route } from '@angular/router';

export const skeletonRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./overview/overview').then(c => c.Overview)
  }
];
