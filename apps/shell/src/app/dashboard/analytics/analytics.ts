import { Component, inject, signal } from '@angular/core';
import { Dashboard, WidgetItem, WidgetConfig } from '@ng-mf/components';
import { Page } from '@/_partials/page/page';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  imports: [Dashboard, Page],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  configs = signal<WidgetConfig[]>([
    {
      type: 'analytics-total-users-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/analytics-total-users-widget/analytics-total-users-widget'
        ).then((c) => c.AnalyticsTotalUsersWidget),
    },
    {
      type: 'analytics-active-users-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/analytics-active-users-widget/analytics-active-users-widget'
        ).then((c) => c.AnalyticsActiveUsersWidget),
    },
    {
      type: 'analytics-new-signups-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/analytics-new-signups-widget/analytics-new-signups-widget'
        ).then((c) => c.AnalyticsNewSignupsWidget),
    },
    {
      type: 'analytics-conversion-rate-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/analytics-conversion-rate-widget/analytics-conversion-rate-widget'
        ).then((c) => c.AnalyticsConversionRateWidget),
    },
    {
      type: 'analytics-total-projects-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/analytics-total-projects-widget/analytics-total-projects-widget'
        ).then((c) => c.AnalyticsTotalProjectsWidget),
    },
    {
      type: 'analytics-ended-projects-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/analytics-ended-projects-widget/analytics-ended-projects-widget'
        ).then((c) => c.AnalyticsEndedProjectsWidget),
    },
    {
      type: 'analytics-running-projects-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/analytics-running-projects-widget/analytics-running-projects-widget'
        ).then((c) => c.AnalyticsRunningProjectsWidget),
    },
    {
      type: 'analytics-pending-projects-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/analytics-pending-projects-widget/analytics-pending-projects-widget'
        ).then((c) => c.AnalyticsPendingProjectsWidget),
    },
    {
      type: 'analytics-followers-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/analytics-followers-widget/analytics-followers-widget'
        ).then((c) => c.AnalyticsFollowersWidget),
    },
    {
      type: 'analytics-likes-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/analytics-likes-widget/analytics-likes-widget'
        ).then((c) => c.AnalyticsLikesWidget),
    },
    {
      type: 'analytics-comments-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/analytics-comments-widget/analytics-comments-widget'
        ).then((c) => c.AnalyticsCommentsWidget),
    },
    {
      type: 'analytics-avg-order-value-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/analytics-avg-order-value-widget/analytics-avg-order-value-widget'
        ).then((c) => c.AnalyticsAvgOrderValueWidget),
    },
    {
      type: 'analytics-total-orders-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/analytics-total-orders-widget/analytics-total-orders-widget'
        ).then((c) => c.AnalyticsTotalOrdersWidget),
    },
    {
      type: 'analytics-gross-revenue-widget',
      skeleton: null,
      component: () =>
        import(
          '@/widgets/_widgets/analytics-gross-revenue-widget/analytics-gross-revenue-widget'
        ).then((c) => c.AnalyticsGrossRevenueWidget),
    },
  ]);
  items = signal<WidgetItem[]>([
    {
      id: 12,
      type: 'analytics-gross-revenue-widget',
      columns: 4,
    },
    {
      id: 13,
      type: 'analytics-avg-order-value-widget',
      columns: 4,
    },
    {
      id: 14,
      type: 'analytics-total-orders-widget',
      columns: 4,
    },
    {
      id: 9,
      type: 'analytics-followers-widget',
      columns: 4,
    },
    {
      id: 10,
      type: 'analytics-likes-widget',
      columns: 4,
    },
    {
      id: 11,
      type: 'analytics-comments-widget',
      columns: 4,
    },
    {
      id: 1,
      type: 'analytics-total-users-widget',
      columns: 3,
    },
    {
      id: 2,
      type: 'analytics-active-users-widget',
      columns: 3,
    },
    {
      id: 3,
      type: 'analytics-new-signups-widget',
      columns: 3,
    },
    {
      id: 4,
      type: 'analytics-conversion-rate-widget',
      columns: 3,
    },
    {
      id: 5,
      type: 'analytics-total-projects-widget',
      columns: 3,
    },
    {
      id: 6,
      type: 'analytics-ended-projects-widget',
      columns: 3,
    },
    {
      id: 7,
      type: 'analytics-running-projects-widget',
      columns: 3,
    },
    {
      id: 8,
      type: 'analytics-pending-projects-widget',
      columns: 3,
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
        id: 'analytics',
        name: 'Analytics',
        type: null,
      },
    ]);
  }
}
