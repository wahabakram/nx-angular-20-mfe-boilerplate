import { Component, inject, signal } from '@angular/core';
import { AvgClickRateWidget } from '@/widgets/_widgets/avg-click-rate-widget/avg-click-rate-widget';
import { AvgOpenRateWidget } from '@/widgets/_widgets/avg-open-rate-widget/avg-open-rate-widget';
import { TotalSubscribersWidget } from '@/widgets/_widgets/total-subscribers-widget/total-subscribers-widget';
import { UniqueVisitorsWidget } from '@/widgets/_widgets/unique-visitors-widget/unique-visitors-widget';
import { AnalyticsActiveUsersWidget } from '@/widgets/_widgets/analytics-active-users-widget/analytics-active-users-widget';
import { AnalyticsAvgOrderValueWidget } from '@/widgets/_widgets/analytics-avg-order-value-widget/analytics-avg-order-value-widget';
import { AnalyticsCommentsWidget } from '@/widgets/_widgets/analytics-comments-widget/analytics-comments-widget';
import { AnalyticsConversionRateWidget } from '@/widgets/_widgets/analytics-conversion-rate-widget/analytics-conversion-rate-widget';
import { AnalyticsEndedProjectsWidget } from '@/widgets/_widgets/analytics-ended-projects-widget/analytics-ended-projects-widget';
import { AnalyticsFollowersWidget } from '@/widgets/_widgets/analytics-followers-widget/analytics-followers-widget';
import { AnalyticsGrossRevenueWidget } from '@/widgets/_widgets/analytics-gross-revenue-widget/analytics-gross-revenue-widget';
import { AnalyticsLikesWidget } from '@/widgets/_widgets/analytics-likes-widget/analytics-likes-widget';
import { AnalyticsNewSignupsWidget } from '@/widgets/_widgets/analytics-new-signups-widget/analytics-new-signups-widget';
import { AnalyticsPendingProjectsWidget } from '@/widgets/_widgets/analytics-pending-projects-widget/analytics-pending-projects-widget';
import { AnalyticsRunningProjectsWidget } from '@/widgets/_widgets/analytics-running-projects-widget/analytics-running-projects-widget';
import { AnalyticsTotalOrdersWidget } from '@/widgets/_widgets/analytics-total-orders-widget/analytics-total-orders-widget';
import { AnalyticsTotalProjectsWidget } from '@/widgets/_widgets/analytics-total-projects-widget/analytics-total-projects-widget';
import { AnalyticsTotalUsersWidget } from '@/widgets/_widgets/analytics-total-users-widget/analytics-total-users-widget';
import { TodaySalesWidget } from '@/widgets/_widgets/today-sales-widget/today-sales-widget';
import { ProductiveTimeWidget } from '@/widgets/_widgets/productive-time-widget/productive-time-widget';
import {
  ChartDataPoint,
  ChartSeries,
  TransactionsOverviewWidget,
} from '@/widgets/_widgets/transactions-overview-widget/transactions-overview-widget';
import { SalesOverviewWidget } from '@/widgets/_widgets/sales-overview-widget/sales-overview-widget';
import { BreadcrumbsStore } from '@ng-mf/components';
import { TrafficChartWidget } from '@/widgets/_widgets/traffic-chart-widget/traffic-chart-widget';
import {
  TrafficByLocationWidget,
  ITrafficByLocationWidget,
} from '@/widgets/_widgets/traffic-by-location-widget/traffic-by-location-widget';
import {
  LeadGenerationWidget,
  LeadGenerationWidgetData,
} from '@/widgets/_widgets/lead-generation-widget/lead-generation-widget';
import {
  SalesConversionWidget,
  SalesConversionWidgetData,
} from '@/widgets/_widgets/sales-conversion-widget/sales-conversion-widget';
import {
  EngagementWidget,
  EngagementWidgetData,
} from '@/widgets/_widgets/engagement-widget/engagement-widget';

@Component({
  selector: 'app-analytics',
  imports: [
    AvgClickRateWidget,
    AvgOpenRateWidget,
    TotalSubscribersWidget,
    UniqueVisitorsWidget,
    AnalyticsActiveUsersWidget,
    AnalyticsAvgOrderValueWidget,
    AnalyticsCommentsWidget,
    AnalyticsConversionRateWidget,
    AnalyticsEndedProjectsWidget,
    AnalyticsFollowersWidget,
    AnalyticsGrossRevenueWidget,
    AnalyticsLikesWidget,
    AnalyticsNewSignupsWidget,
    AnalyticsPendingProjectsWidget,
    AnalyticsRunningProjectsWidget,
    AnalyticsTotalOrdersWidget,
    AnalyticsTotalProjectsWidget,
    AnalyticsTotalUsersWidget,
    TodaySalesWidget,
    ProductiveTimeWidget,
    TransactionsOverviewWidget,
    SalesOverviewWidget,
    TrafficChartWidget,
    TrafficByLocationWidget,
    LeadGenerationWidget,
    SalesConversionWidget,
    EngagementWidget,
  ],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
})
export class Analytics {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  // Top widgets: Lead generation, Sales conversion, Engagement
  readonly leadGenerationWidget = signal<LeadGenerationWidgetData>({
    id: crypto.randomUUID(),
    title: 'Lead generation',
    value: 2245,
    from: 987,
    percentageChange: 28,
  });
  readonly salesConversionWidget = signal<SalesConversionWidgetData>({
    id: crypto.randomUUID(),
    title: 'Sales conversion',
    value: 12.4,
    from: 14.2,
    percentageChange: -3.1,
  });
  readonly engagementWidget = signal<EngagementWidgetData>({
    id: crypto.randomUUID(),
    title: 'Engagement',
    value: 68,
    from: 62,
    percentageChange: 5.6,
  });

  readonly productiveHours = signal(12.4);
  readonly change = signal(23);
  readonly chartData = signal([10.1, 11.5, 11.0, 11.8, 11.2, 12.0, 12.4]);
  readonly deviceData = signal<Array<[string, number]>>([
    ['Linux', 18],
    ['Mac', 30.5],
    ['iOS', 22],
    ['Windows', 31.5],
    ['Android', 14],
    ['Other', 26],
  ]);
  readonly trafficByLocationWidget = signal<ITrafficByLocationWidget>({
    id: crypto.randomUUID(),
    name: 'Traffic By Location',
    data: [
      { name: 'United States', value: 52.1, color: '#3B82F6' },
      { name: 'Canada', value: 22.8, color: '#818CF8' },
      { name: 'Mexico', value: 13.9, color: '#F97316' },
      { name: 'Other', value: 11.2, color: '#9CA3AF' },
    ],
  });

  public readonly chartSeriesData: ChartSeries<ChartDataPoint>[];

  constructor() {
    this.chartSeriesData = [
      {
        name: 'Total Transaction',
        color: '#8B5CF6',
        isActive: true,
        data: this.generateRandomData(365, 500, 2000),
      },
      {
        name: 'Earning',
        color: '#10B981',
        isActive: false,
        data: this.generateRandomData(365, 100, 500),
      },
    ];
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'account',
        name: 'Widgets',
        route: '/widgets/general',
        type: 'link',
      },
      {
        id: 'analytics',
        name: 'Analytics',
        type: null,
      },
    ]);
  }

  private generateRandomData(
    days: number,
    min: number,
    max: number
  ): ChartDataPoint[] {
    const data: ChartDataPoint[] = [];
    const today = new Date();
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);

      if (Math.random() > 0.3) {
        data.push({
          date: date,
          value: Math.floor(Math.random() * (max - min + 1)) + min,
        });
      }
    }
    return data;
  }
}
