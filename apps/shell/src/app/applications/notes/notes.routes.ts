import { Route } from '@angular/router';

export const notesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./notes/notes').then((c) => c.Notes),
  },
];
