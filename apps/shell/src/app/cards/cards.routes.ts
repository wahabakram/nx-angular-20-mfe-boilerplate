import { Route } from '@angular/router';

export const cardsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./common/common').then(c => c.Common),
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'general'
      },
      {
        path: 'general',
        loadComponent: () => import('./general/general').then(c => c.General),
        title: 'General'
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users').then(c => c.Users),
        title: 'Users'
      }
    ]
  }
];
