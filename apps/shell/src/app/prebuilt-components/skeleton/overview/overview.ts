import { Component, inject } from '@angular/core';
import { DashboardCardsExample } from '../_examples/dashboard-cards-example/dashboard-cards-example';
import { DashboardChartExample } from '../_examples/dashboard-chart-example/dashboard-chart-example';
import { DashboardExample } from '../_examples/dashboard-example/dashboard-example';
import { Page } from '@/meta/page/page';
import { PageContentDirective } from '@/meta/page/page-content.directive';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [
    Page,
    PageContentDirective,
    DashboardCardsExample,
    DashboardChartExample,
    DashboardExample
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview {
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
        id: 'skeleton',
        name: 'Skeleton',
        type: null
      }
    ]);
  }
}
