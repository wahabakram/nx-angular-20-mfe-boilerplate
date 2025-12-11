import { Route } from '@angular/router';

export const salesRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./sales-list/sales-list').then(m => m.SalesList),
  },
  {
    path: 'new',
    loadComponent: () => import('./sale-form/sale-form').then(m => m.SaleForm),
  },
  {
    path: 'quotations',
    loadComponent: () => import('./quotations/quotation-list/quotation-list').then(m => m.QuotationList),
  },
  {
    path: 'quotations/new',
    loadComponent: () => import('./quotation-form/quotation-form').then(m => m.QuotationForm),
  },
  {
    path: 'quotations/:id/edit',
    loadComponent: () => import('./quotation-form/quotation-form').then(m => m.QuotationForm),
  },
  {
    path: 'quotations/:id',
    loadComponent: () => import('./quotation-detail/quotation-detail').then(m => m.QuotationDetail),
  },
  {
    path: 'returns',
    loadComponent: () => import('./returns-list/returns-list').then(m => m.ReturnsList),
  },
  {
    path: 'returns/new',
    loadComponent: () => import('./return-form/return-form').then(m => m.ReturnForm),
  },
  {
    path: 'returns/:id',
    loadComponent: () => import('./return-detail/return-detail').then(m => m.ReturnDetail),
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./sale-form/sale-form').then(m => m.SaleForm),
  },
  {
    path: ':id',
    loadComponent: () => import('./sale-details/sale-details').then(m => m.SaleDetails),
  },
];
