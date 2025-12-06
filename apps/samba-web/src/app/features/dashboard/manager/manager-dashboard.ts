import { Component, signal } from '@angular/core';
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';
import { Page } from '../../../_partials/page/page';

@Component({
  selector: 'app-manager-dashboard',
  imports: [
    Dashboard,
    Page
  ],
  templateUrl: './manager-dashboard.html',
  styleUrl: './manager-dashboard.scss'
})
export class ManagerDashboard {
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
      type: 'total-products-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/total-products-widget/total-products-widget').then(
          (c) => c.TotalProductsWidget
        ),
    },
    {
      type: 'low-stock-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/low-stock-widget/low-stock-widget').then(
          (c) => c.LowStockWidget
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
      type: 'recent-sales-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/recent-sales-widget/recent-sales-widget').then(
          (c) => c.RecentSalesWidget
        ),
    },
    {
      type: 'quick-action-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/quick-action-widget/quick-action-widget').then(
          (c) => c.QuickActionWidget
        ),
    },
    {
      type: 'heading-widget',
      skeleton: null,
      plain: true,
      component: () =>
        import('../../../widgets/_widgets/heading-widget/heading-widget').then(
          (c) => c.HeadingWidget
        ),
    },
  ]);

  items = signal<WidgetItem[]>([
    {
      id: 1,
      type: 'total-sales-widget',
      columns: 4,
    },
    {
      id: 2,
      type: 'total-products-widget',
      columns: 4,
    },
    {
      id: 3,
      type: 'low-stock-widget',
      columns: 4,
    },
    {
      id: 4,
      type: 'recent-sales-widget',
      columns: 8,
      skeletonHeight: '400px',
    },
    {
      id: 5,
      type: 'revenue-widget',
      columns: 4,
    },
    {
      id: 6,
      type: 'heading-widget',
      columns: 12,
      widget: {
        title: 'Quick Actions',
      },
    },
    {
      id: 7,
      type: 'quick-action-widget',
      columns: 4,
      widget: {
        iconName: 'point_of_sale',
        title: 'Open POS',
        description: 'Start a new sales transaction',
        route: '/pos',
      },
    },
    {
      id: 8,
      type: 'quick-action-widget',
      columns: 4,
      widget: {
        iconName: 'sync_alt',
        title: 'Stock Adjustment',
        description: 'Update inventory levels',
        route: '/inventory',
      },
    },
    {
      id: 9,
      type: 'quick-action-widget',
      columns: 4,
      widget: {
        iconName: 'receipt_long',
        title: 'Sales Report',
        description: 'View daily sales summary',
        route: '/reports/sales',
      },
    },
  ]);
}
