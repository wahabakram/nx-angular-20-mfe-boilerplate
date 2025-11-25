import { Component, computed, inject, signal } from '@angular/core';
import {
  CommonStatsWidget,
  StatCard,
} from '@/widgets/_widgets/common-stats/common-stats.widget';
import { PurchasesByChannelsWidget } from '@/widgets/_widgets/purchases-by-channels-widget/purchases-by-channels-widget';
import { CardBalanceWidget } from '@/widgets/_widgets/card-balance-widget/card-balance-widget';
import { FinanceInformationWidget } from '@/widgets/_widgets/finance-information-widget/finance-information-widget';
import { FinanceExpensesWidget } from '@/widgets/_widgets/finance-expenses-widget/finance-expenses-widget';
import { BreadcrumbsStore } from '@ng-mf/components';
import {
  IncomeExpenseChartData,
  IncomeExpenseStatisticWidget,
  IIncomeExpenseStatisticWidget,
} from '@/widgets/_widgets/income-expense-statistic-widget/income-expense-statistic-widget';

@Component({
  imports: [
    CommonStatsWidget,
    PurchasesByChannelsWidget,
    CardBalanceWidget,
    FinanceInformationWidget,
    FinanceExpensesWidget,
    IncomeExpenseStatisticWidget,
  ],
  templateUrl: './finance.html',
  styleUrl: './finance.scss',
})
export class Finance {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  readonly stats = signal<StatCard[]>([
    {
      title: 'Total Sales',
      icon: 'shopping_cart',
      currentValue: 2500,
      percentageChange: 4.9,
      lastMonthValue: 2345,
    },
    {
      title: 'New Customer',
      icon: 'group',
      currentValue: 110,
      percentageChange: 7.5,
      lastMonthValue: 89,
    },
    {
      title: 'Return Products',
      icon: 'inventory_2',
      currentValue: 72,
      percentageChange: -6.0,
      lastMonthValue: 60,
    },
    {
      title: 'Total Revenue',
      icon: 'attach_money',
      currentValue: 8220.64,
      lastMonthValue: 620.0,
      valuePrefix: '$',
    },
  ]);
  readonly purchasesByChannelsWidget = signal({
    name: 'Purchases by Channels',
  });

  constructor() {
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
        id: 'finance',
        name: 'Finance',
        type: null,
      },
    ]);
  }

  private generateChartData(range: string): IncomeExpenseChartData {
    const dataPointCount = this.getDataPointCountForRange(range);

    const incomeData = Array.from(
      { length: dataPointCount },
      () => Math.floor(Math.random() * 800) + 200
    );
    const expenseData = Array.from(
      { length: dataPointCount },
      () => Math.floor(Math.random() * 600) + 100
    );

    return {
      income: incomeData,
      expense: expenseData,
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

  incomeExpenseChartWidget = signal<IIncomeExpenseStatisticWidget>({
    name: 'Income & Expense',
    chartData: this.generateChartData('weekly'),
    timeRange: 'weekly',
  });
}
