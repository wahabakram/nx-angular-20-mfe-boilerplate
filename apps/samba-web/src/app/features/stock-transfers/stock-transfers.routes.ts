import { Routes } from '@angular/router';

export const stockTransfersRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./transfer-list/transfer-list').then((m) => m.TransferList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./transfer-form/transfer-form').then((m) => m.TransferForm),
  },
  {
    path: ':id/view',
    loadComponent: () =>
      import('./transfer-form/transfer-form').then((m) => m.TransferForm),
  },
];
