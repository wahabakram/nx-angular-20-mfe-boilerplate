import { Route } from '@angular/router';

export const themesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./overview/overview').then(c => c.Overview),
    title: 'Themes'
  }
];
