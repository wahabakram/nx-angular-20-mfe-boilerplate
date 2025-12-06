import { Route } from '@angular/router';

export const salesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./sales-list/sales-list').then(m => m.SalesList),
  },
  {
    path: 'quotations',
    loadComponent: () => import('./quotations/quotation-list/quotation-list').then(m => m.QuotationList),
  },
  {
    path: ':id',
    loadComponent: () => import('./sale-details/sale-details').then(m => m.SaleDetails),
  },
];
