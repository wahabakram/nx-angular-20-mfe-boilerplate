import { Component, inject, signal } from '@angular/core';
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate
} from '@angular/material/datepicker';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { Dashboard, WidgetConfig, WidgetItem } from '@ng-mf/components';
import {
  DashboardCardsSkeleton,
  DashboardChartWidgetSkeleton,
} from '@/components/skeleton';
import { Page } from '@/_partials/page/page';
import { BreadcrumbsStore } from '@ng-mf/components';
import {
  IncomeExpenseChartData
} from '@/widgets/_widgets/income-expense-statistic-widget/income-expense-statistic-widget';

@Component({
  imports: [
    MatDateRangeInput,
    MatEndDate,
    MatStartDate,
    MatDateRangePicker,
    MatDatepickerToggle,
    MatFormField,
    MatSuffix,
    Dashboard,
    Page
  ],
  templateUrl: './ecommerce.html',
  styleUrl: './ecommerce.scss'
})
export class Ecommerce {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  configs = signal<WidgetConfig[]>([
    {
      type: 'today-sales-widget',
      skeleton: DashboardCardsSkeleton,
      component: () =>
        import('@/widgets/_widgets/today-sales-widget/today-sales-widget')
          .then(c => c.TodaySalesWidget)
    },
    {
      type: 'purchases-by-channels-widget',
      skeleton: DashboardChartWidgetSkeleton,
      component: () =>
        import('@/widgets/_widgets/purchases-by-channels-widget/purchases-by-channels-widget')
          .then(c => c.PurchasesByChannelsWidget)
    },
    {
      type: 'customer-satisfaction-widget',
      component: () =>
        import('@/widgets/_widgets/customer-satisfaction-widget/customer-satisfaction-widget')
          .then(c => c.CustomerSatisfactionWidget)
    },
    {
      type: 'expense-income-expense-statistic-widget',
      component: () =>
        import('@/widgets/_widgets/income-expense-statistic-widget/income-expense-statistic-widget')
          .then(c => c.IncomeExpenseStatisticWidget)
    },
    {
      type: 'lead-generation-widget-widget',
      component: () =>
        import('@/widgets/_widgets/lead-generation-widget/lead-generation-widget')
          .then(c => c.LeadGenerationWidget)
    },
    {
      type: 'lead-generation-widget-widget',
      component: () =>
        import('@/widgets/_widgets/lead-generation-widget/lead-generation-widget')
          .then(c => c.LeadGenerationWidget)
    },
    {
      type: 'sales-conversion-widget',
      component: () =>
        import('@/widgets/_widgets/sales-conversion-widget/sales-conversion-widget')
          .then(c => c.SalesConversionWidget)
    },
    {
      type: 'engagement-widget',
      component: () =>
        import('@/widgets/_widgets/engagement-widget/engagement-widget')
          .then(c => c.EngagementWidget)
    },
  ]);
  items = signal<WidgetItem[]>([
    {
      id: crypto.randomUUID(),
      type: 'expense-income-expense-statistic-widget',
      columns: 8,
      widget: {
        height: '385px',
        name: 'Income & Expense',
        chartData: this.generateChartData('weekly'),
        timeRange: 'weekly'
      },
    },
    {
      id: crypto.randomUUID,
      columns: 4,
      children: [
        {
          id: crypto.randomUUID(),
          type: 'lead-generation-widget-widget',
          columns: 12,
          widget: {
            id: crypto.randomUUID(),
            title: 'Lead generation',
            value: 2245,
            from: 987,
            percentageChange: 28
          },
        },
        {
          id: crypto.randomUUID(),
          type: 'sales-conversion-widget',
          columns: 12,
          widget: {
            id: crypto.randomUUID(),
            title: 'Sales conversion',
            value: 12.4,
            from: 14.2,
            percentageChange: -3.1
          },
        },
        {
          id: crypto.randomUUID(),
          type: 'engagement-widget',
          columns: 12,
          widget: {
            id: crypto.randomUUID(),
            title: 'Engagement',
            value: 68,
            from: 62,
            percentageChange: 5.6
          },
        }
      ]
    },
    {
      id: 1,
      type: 'today-sales-widget',
      columns: 12,
    },
    {
      id: 2,
      type: 'purchases-by-channels-widget',
      columns: 12,
      widget: {
        name: 'Purchases by channels',
      }
    },
    {
      id: 5,
      type: 'customer-satisfaction-widget',
      columns: 4,
      skeletonHeight: '300px'
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
        id: 'ecommerce',
        name: 'Ecommerce',
        type: null
      }
    ]);
  }

  private generateChartData(range: string): IncomeExpenseChartData {
    const dataPointCount = this.getDataPointCountForRange(range);

    const incomeData = Array.from({ length: dataPointCount }, () => Math.floor(Math.random() * 800) + 200);
    const expenseData = Array.from({ length: dataPointCount }, () => Math.floor(Math.random() * 600) + 100);

    return {
      income: incomeData,
      expense: expenseData
    };
  }

  private getDataPointCountForRange(range: string): number {
    switch (range) {
      case 'Daily':
        return 6;
      case 'Weekly':
        return 7;
      case 'Monthly':
        return 4;
      default:
        return 7;
    }
  }
}
