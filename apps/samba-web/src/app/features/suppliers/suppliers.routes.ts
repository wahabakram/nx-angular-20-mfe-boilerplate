import { Routes } from '@angular/router';

export const suppliersRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./supplier-list/supplier-list').then((m) => m.SupplierList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./supplier-form/supplier-form').then((m) => m.SupplierForm),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./supplier-form/supplier-form').then((m) => m.SupplierForm),
  },
  {
    path: ':id/ledger',
    loadComponent: () =>
      import('./supplier-ledger/supplier-ledger').then((m) => m.SupplierLedger),
  },
  {
    path: ':id/payment',
    loadComponent: () =>
      import('./supplier-payment/supplier-payment').then((m) => m.SupplierPayment),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./supplier-detail/supplier-detail').then((m) => m.SupplierDetail),
  },
];
