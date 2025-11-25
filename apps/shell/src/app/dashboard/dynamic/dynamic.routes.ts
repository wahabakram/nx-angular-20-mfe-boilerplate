import { Route } from '@angular/router';

export const dynamicRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./dynamic/dynamic').then(c => c.Dynamic),
    title: 'Dynamic Dashboard'
  }
];
