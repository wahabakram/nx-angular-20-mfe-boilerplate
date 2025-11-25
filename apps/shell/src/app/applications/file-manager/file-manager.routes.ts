import { Route } from '@angular/router';

export const fileManagerRoutes: Route[] = [
  {
    path: '',
    title: 'File Manager',
    loadComponent: () =>
      import('./file-manager/file-manager').then((c) => c.FileManager),
  },
];
