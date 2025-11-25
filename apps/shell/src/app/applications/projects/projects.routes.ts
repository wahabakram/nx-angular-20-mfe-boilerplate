import { Route } from '@angular/router';

export const projectsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./projects/projects').then((c) => c.Projects),
  },
];
