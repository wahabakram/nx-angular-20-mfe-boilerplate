import { Routes } from '@angular/router';

export const purchasesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./purchase-list/purchase-list').then((m) => m.PurchaseList),
  },
  {
    path: 'new',
    loadComponent: () =>
      import('./purchase-form/purchase-form').then((m) => m.PurchaseForm),
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./purchase-form/purchase-form').then((m) => m.PurchaseForm),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./purchase-detail/purchase-detail').then((m) => m.PurchaseDetail),
  },
  {
    path: ':id/receive',
    loadComponent: () =>
      import('./purchase-receive/purchase-receive').then((m) => m.PurchaseReceive),
  },
  {
    path: 'returns',
    loadComponent: () =>
      import('./purchase-returns-list/purchase-returns-list').then((m) => m.PurchaseReturnsList),
  },
  {
    path: 'returns/new/:purchaseId',
    loadComponent: () =>
      import('./purchase-return-form/purchase-return-form').then((m) => m.PurchaseReturnForm),
  },
];
