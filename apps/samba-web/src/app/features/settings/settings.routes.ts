import { Route } from '@angular/router';

export const settingsRoutes: Route[] = [
  {
    path: 'users',
    loadComponent: () => import('./users/user-list/user-list').then(m => m.UserList),
  },
  {
    path: 'branches',
    loadComponent: () => import('./branches/branch-list/branch-list').then(m => m.BranchList),
  },
  {
    path: 'categories',
    loadComponent: () => import('./categories/category-list/category-list').then(m => m.CategoryList),
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
];
