import { Routes } from '@angular/router';

export const invoicesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./invoice-list/invoice-list').then((m) => m.InvoiceList),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./invoice-create/invoice-create').then((m) => m.InvoiceCreate),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./invoice-detail/invoice-detail').then((m) => m.InvoiceDetail),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./invoice-edit/invoice-edit').then((m) => m.InvoiceEdit),
  },
];
