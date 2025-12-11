import { Component, inject, signal } from '@angular/core';
import { BreadcrumbsStore, Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';
import { Page } from '../../../_partials/page/page';

@Component({
  selector: 'app-admin-dashboard',
  imports: [Dashboard, Page],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  configs = signal<WidgetConfig[]>([
    {
      type: 'total-sales-widget',
      skeleton: null,
      component: () =>
        import(
          '../../../widgets/_widgets/total-sales-widget/total-sales-widget'
        ).then((c) => c.TotalSalesWidget),
    },
    {
      type: 'total-products-widget',
      skeleton: null,
      component: () =>
        import(
          '../../../widgets/_widgets/total-products-widget/total-products-widget'
        ).then((c) => c.TotalProductsWidget),
    },
    {
      type: 'low-stock-widget',
      skeleton: null,
      component: () =>
        import(
          '../../../widgets/_widgets/low-stock-widget/low-stock-widget'
        ).then((c) => c.LowStockWidget),
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
      type: 'total-returns-widget',
      skeleton: null,
      component: () =>
        import(
          '../../../widgets/_widgets/total-returns-widget/total-returns-widget'
        ).then((c) => c.TotalReturnsWidget),
    },
    {
      type: 'return-rate-widget',
      skeleton: null,
      component: () =>
        import(
          '../../../widgets/_widgets/return-rate-widget/return-rate-widget'
        ).then((c) => c.ReturnRateWidget),
    },
    {
      type: 'outstanding-balances-widget',
      skeleton: null,
      component: () =>
        import(
          '../../../widgets/_widgets/outstanding-balances-widget/outstanding-balances-widget'
        ).then((c) => c.OutstandingBalancesWidget),
    },
    {
      type: 'recent-sales-widget',
      skeleton: null,
      component: () =>
        import(
          '../../../widgets/_widgets/recent-sales-widget/recent-sales-widget'
        ).then((c) => c.RecentSalesWidget),
    },
    {
      type: 'quick-action-widget',
      skeleton: null,
      component: () =>
        import(
          '../../../widgets/_widgets/quick-action-widget/quick-action-widget'
        ).then((c) => c.QuickActionWidget),
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
    {
      type: 'data-management-widget',
      skeleton: null,
      component: () =>
        import(
          '../../../widgets/_widgets/data-management-widget/data-management-widget'
        ).then((c) => c.DataManagementWidget),
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
      type: 'total-products-widget',
      columns: 3,
    },
    {
      id: 3,
      type: 'low-stock-widget',
      columns: 3,
    },
    {
      id: 4,
      type: 'revenue-widget',
      columns: 3,
    },
    {
      id: 5,
      type: 'total-returns-widget',
      columns: 4,
    },
    {
      id: 6,
      type: 'return-rate-widget',
      columns: 4,
    },
    {
      id: 7,
      type: 'outstanding-balances-widget',
      columns: 4,
    },
    {
      id: 8,
      type: 'recent-sales-widget',
      columns: 12,
      skeletonHeight: '400px',
    },
    {
      id: 9,
      type: 'heading-widget',
      columns: 12,
      widget: {
        title: 'Quick Actions',
      },
    },
    {
      id: 10,
      type: 'quick-action-widget',
      columns: 4,
      widget: {
        iconName: 'solar:box-minimalistic-line-duotone',
        title: 'Manage Products',
        description: 'Add, edit, and organize your product catalog',
        route: '/products',
      },
    },
    {
      id: 11,
      type: 'quick-action-widget',
      columns: 4,
      widget: {
        iconName: 'solar:users-group-rounded-line-duotone',
        title: 'Manage Users',
        description: 'Control user access and permissions',
        route: '/users',
      },
    },
    {
      id: 12,
      type: 'quick-action-widget',
      columns: 4,
      widget: {
        iconName: 'solar:chart-line-duotone',
        title: 'View Reports',
        description: 'Analyze sales and business metrics',
        route: '/reports/sales',
      },
    },
    {
      id: 13,
      type: 'heading-widget',
      columns: 12,
      widget: {
        title: 'System Administration',
      },
    },
    {
      id: 14,
      type: 'data-management-widget',
      columns: 6,
    },
  ]);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'dashboard',
        name: 'Dashboard',
        type: null,
      },
    ]);
  }
}
