import { Route } from '@angular/router';
import { loadRemote } from '@module-federation/enhanced/runtime';

export const appRoutes: Route[] = [
  {
    path: 'webcomponents',
    loadChildren: () =>
      loadRemote<typeof import('webcomponents/Routes')>(
        'webcomponents/Routes'
      ).then((m) => m!.remoteRoutes),
  },
  // {
  //   path: '',
  //   component: NxWelcome,
  // },
];
