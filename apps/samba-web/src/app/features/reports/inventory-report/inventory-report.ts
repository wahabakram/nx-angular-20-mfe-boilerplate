import { Component, inject, signal } from '@angular/core';
import { Dashboard, WidgetConfig, WidgetItem, BreadcrumbsStore } from '@ng-mf/components';
import { Page } from '../../../_partials/page/page';

@Component({
  selector: 'app-inventory-report',
  imports: [Dashboard, Page],
  templateUrl: './inventory-report.html',
  styleUrl: './inventory-report.scss'
})
export class InventoryReport {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'reports',
        name: 'Reports',
        route: '/reports',
        type: 'link',
      },
      {
        id: 'inventory-report',
        name: 'Inventory Report',
        type: null,
      },
    ]);
  }

  configs = signal<WidgetConfig[]>([
    {
      type: 'total-products-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/total-products-widget/total-products-widget').then(
          (c) => c.TotalProductsWidget
        ),
    },
    {
      type: 'total-inventory-value-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/total-inventory-value-widget/total-inventory-value-widget').then(
          (c) => c.TotalInventoryValueWidget
        ),
    },
    {
      type: 'low-stock-count-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/low-stock-count-widget/low-stock-count-widget').then(
          (c) => c.LowStockCountWidget
        ),
    },
    {
      type: 'out-of-stock-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/out-of-stock-widget/out-of-stock-widget').then(
          (c) => c.OutOfStockWidget
        ),
    },
    {
      type: 'inventory-by-category-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/inventory-by-category-widget/inventory-by-category-widget').then(
          (c) => c.InventoryByCategoryWidget
        ),
    },
    {
      type: 'stock-movement-widget',
      skeleton: null,
      component: () =>
        import('../../../widgets/_widgets/stock-movement-widget/stock-movement-widget').then(
          (c) => c.StockMovementWidget
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
  ]);

  items = signal<WidgetItem[]>([
    {
      id: 1,
      type: 'total-products-widget',
      columns: 3,
    },
    {
      id: 2,
      type: 'total-inventory-value-widget',
      columns: 3,
    },
    {
      id: 3,
      type: 'low-stock-count-widget',
      columns: 3,
    },
    {
      id: 4,
      type: 'out-of-stock-widget',
      columns: 3,
    },
    {
      id: 5,
      type: 'inventory-by-category-widget',
      columns: 6,
      skeletonHeight: '350px',
    },
    {
      id: 6,
      type: 'stock-movement-widget',
      columns: 6,
      skeletonHeight: '350px',
    },
    {
      id: 7,
      type: 'low-stock-widget',
      columns: 12,
      skeletonHeight: '400px',
    },
  ]);
}
