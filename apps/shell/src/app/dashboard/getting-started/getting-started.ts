import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Page } from '@/_partials/page/page';
import { BreadcrumbsStore } from '@ng-mf/components';
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';

@Component({
  imports: [
    RouterLink,
    MatButton,
    MatIcon,
    Page,
    Dashboard
  ],
  templateUrl: './getting-started.html',
  styleUrl: './getting-started.scss'
})
export class GettingStarted {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  configs = signal<WidgetConfig[]>([
    {
      type: 'welcome-widget',
      skeleton: null,
      component: () =>
        import('@/widgets/_widgets/welcome-widget/welcome-widget').then(c => c.WelcomeWidget)
    },
    {
      type: 'getting-started-widget',
      skeleton: null,
      component: () =>
        import('@/widgets/_widgets/getting-started-widget/getting-started-widget').then(c => c.GettingStartedWidget)
    },
    {
      type: 'recent-events-widget',
      skeleton: null,
      component: () =>
        import('@/widgets/_widgets/recent-events-widget/recent-events-widget').then(c => c.RecentEventsWidget)
    },
    {
      type: 'basic-metric-widget',
      skeleton: null,
      component: () =>
        import('@/widgets/_widgets/basic-metric-widget/basic-metric-widget').then(c => c.BasicMetricWidget)
    },
  ]);
  items = signal<WidgetItem[]>([
    {
      id: crypto.randomUUID(),
      columns: 12,
      type: 'welcome-widget',
    },
    {
      id: 1,
      columns: 8,
      children: [
        {
          id: 3,
          type: 'getting-started-widget',
          columns: 12
        },
        {
          id: 3,
          type: 'basic-metric-widget',
          columns: 4,
          widget: {
            id: 1,
            data: {
              name: 'Views',
              value: 7265,
              percentageChange: 11.01,
              viewUrl: '/dashboard/analytics'
            }
          }
        },
        {
          id: 3,
          type: 'basic-metric-widget',
          columns: 4,
          widget: {
            id: 1,
            data: {
              name: 'New Users',
              value: 23,
              percentageChange: 1.00,
              viewUrl: '/dashboard/analytics'
            }
          }
        },
        {
          id: 3,
          type: 'basic-metric-widget',
          columns: 4,
          widget: {
            id: 1,
            data: {
              name: 'New Orders',
              value: 2,
              percentageChange: -8.33,
              viewUrl: '/dashboard/analytics'
            }
          }
        },
      ]
    },
    {
      id: 2,
      columns: 4,
      children: [
        {
          id: 3,
          type: 'recent-events-widget',
          columns: 12
        },
      ]
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
        id: 'getStarted',
        name: 'Get Started',
        type: null
      }
    ]);
  }
}
