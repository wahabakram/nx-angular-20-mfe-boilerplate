import { Route } from '@angular/router';

export const remoteRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('../app.routes').then((m) => m.appRoutes),
  },
];
