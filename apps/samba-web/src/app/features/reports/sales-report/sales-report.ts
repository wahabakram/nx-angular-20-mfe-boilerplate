import { Component, signal } from '@angular/core';
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';
import { Page } from '../../../_partials/page/page';

@Component({
  selector: 'app-sales-report',
  imports: [Dashboard, Page],
  templateUrl: './sales-report.html',
  styleUrl: './sales-report.scss'
})
export class SalesReport {
  configs = signal<WidgetConfig[]>([
    {
      type: 'total-sales-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/total-sales-widget/total-sales-widget').then(
          (c) => c.TotalSalesWidget
        ),
    },
    {
      type: 'revenue-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/revenue-widget/revenue-widget').then(
          (c) => c.RevenueWidget
        ),
    },
    {
      type: 'total-profit-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/total-profit-widget/total-profit-widget').then(
          (c) => c.TotalProfitWidget
        ),
    },
    {
      type: 'average-order-value-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/average-order-value-widget/average-order-value-widget').then(
          (c) => c.AverageOrderValueWidget
        ),
    },
    {
      type: 'daily-sales-trend-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/daily-sales-trend-widget/daily-sales-trend-widget').then(
          (c) => c.DailySalesTrendWidget
        ),
    },
    {
      type: 'sales-by-payment-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/sales-by-payment-widget/sales-by-payment-widget').then(
          (c) => c.SalesByPaymentWidget
        ),
    },
    {
      type: 'top-products-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/top-products-widget/top-products-widget').then(
          (c) => c.TopProductsWidget
        ),
    },
    {
      type: 'recent-sales-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/recent-sales-widget/recent-sales-widget').then(
          (c) => c.RecentSalesWidget
        ),
    },
  ]);

  items = signal<WidgetItem[]>([
    {
      id: 1,
      type: 'total-sales-widget',
      columns: 3,
    },
    {
      id: 2,
      type: 'revenue-widget',
      columns: 3,
    },
    {
      id: 3,
      type: 'total-profit-widget',
      columns: 3,
    },
    {
      id: 4,
      type: 'average-order-value-widget',
      columns: 3,
    },
    {
      id: 5,
      type: 'daily-sales-trend-widget',
      columns: 12,
      skeletonHeight: '350px',
    },
    {
      id: 6,
      type: 'sales-by-payment-widget',
      columns: 6,
      skeletonHeight: '350px',
    },
    {
      id: 7,
      type: 'top-products-widget',
      columns: 6,
      skeletonHeight: '350px',
    },
    {
      id: 8,
      type: 'recent-sales-widget',
      columns: 12,
      skeletonHeight: '400px',
    },
  ]);
}
