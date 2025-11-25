import { Route } from '@angular/router';

export const datatablesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./common/common').then(m => m.Common),
    children: [
      {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full'
      },
      {
        path: 'general',
        loadComponent: () => import('./general/general').then(m => m.General),
        title: 'General'
      },
      {
        path: 'users',
        loadComponent: () => import('./users-datatable/users-datatable').then(m => m.UsersDatatable),
        title: 'Users'
      }
    ]
  },
];
