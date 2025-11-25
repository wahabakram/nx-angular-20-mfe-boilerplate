import { Route } from '@angular/router';

export const postsRoutes: Route[] = [
  {
    path: 'list',
    loadComponent: () => import('./list/list').then(c => c.List),
    title: 'Post List'
  },
  {
    path: 'new',
    loadComponent: () => import('./new/new').then(c => c.New),
    title: 'Create New Post'
  },
  {
    path: 'details',
    loadComponent: () => import('./details/details').then(c => c.Details),
    title: 'View Post Details'
  },
  {
    path: 'edit',
    loadComponent: () => import('./edit/edit').then(c => c.Edit),
    title: 'Edit Post'
  }
];
