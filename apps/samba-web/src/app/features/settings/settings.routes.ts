import { Route } from '@angular/router';

export const settingsRoutes: Route[] = [
  {
    path: 'users',
    loadComponent: () => import('./users/user-list/user-list').then(m => m.UserList),
  },
  {
    path: 'users/new',
    loadComponent: () => import('./users/user-form/user-form').then(m => m.UserForm),
  },
  {
    path: 'users/:id/edit',
    loadComponent: () => import('./users/user-form/user-form').then(m => m.UserForm),
  },
  {
    path: 'branches',
    loadComponent: () => import('./branches/branch-list/branch-list').then(m => m.BranchList),
  },
  {
    path: 'branches/new',
    loadComponent: () => import('./branches/branch-form/branch-form').then(m => m.BranchForm),
  },
  {
    path: 'branches/:id/edit',
    loadComponent: () => import('./branches/branch-form/branch-form').then(m => m.BranchForm),
  },
  {
    path: 'categories',
    loadComponent: () => import('./categories/category-list/category-list').then(m => m.CategoryList),
  },
  {
    path: 'categories/new',
    loadComponent: () => import('./categories/category-form/category-form').then(m => m.CategoryForm),
  },
  {
    path: 'categories/:id/edit',
    loadComponent: () => import('./categories/category-form/category-form').then(m => m.CategoryForm),
  },
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
];
