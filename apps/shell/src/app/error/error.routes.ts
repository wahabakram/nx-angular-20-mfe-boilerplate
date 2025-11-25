import { Route } from '@angular/router';

export const errorRoutes: Route[] = [
  {
    path: 'internal-server-error',
    title: 'Internal Server Error',
    loadComponent: () =>
      import('./internal-server-error/internal-server-error').then(
        (c) => c.InternalServerError
      ),
  },
  {
    path: 'internal-server-error-2',
    title: 'Internal Server Error 2',
    loadComponent: () =>
      import('./internal-server-error-2/internal-server-error-2').then(
        (c) => c.InternalServerError2
      ),
  },
  {
    path: 'forbidden',
    title: 'Forbidden',
    loadComponent: () =>
      import('./forbidden/forbidden').then((c) => c.Forbidden),
  },
  {
    path: 'forbidden-2',
    title: 'Forbidden 2',
    loadComponent: () =>
      import('./forbidden-2/forbidden-2').then((c) => c.Forbidden2),
  },
  {
    path: 'not-found',
    title: 'Not Found',
    loadComponent: () =>
      import('./not-found/not-found').then((c) => c.NotFound),
  },
  {
    path: 'not-found-2',
    title: 'Not Found 2',
    loadComponent: () =>
      import('./not-found-2/not-found-2').then((c) => c.NotFound2),
  },
  {
    path: 'maintenance',
    title: 'Maintenance',
    loadComponent: () =>
      import('./maintenance/maintenance').then((c) => c.Maintenance),
  },
];
