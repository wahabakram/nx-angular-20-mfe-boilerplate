import { Route } from '@angular/router';

export const contentRoutes: Route[] = [
  {
    path: 'posts/list',
    loadComponent: () => import('./post-list/post-list').then(c => c.PostList),
    title: 'Post List'
  }
];
