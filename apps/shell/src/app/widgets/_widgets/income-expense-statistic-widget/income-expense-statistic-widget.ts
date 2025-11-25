import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
  input, model, viewChild, OnInit
} from '@angular/core';
import * as echarts from 'echarts';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VerticalDivider } from '@ng-mf/components';
import { SegmentedButton, Segmented } from '@ng-mf/components';

export interface IncomeExpenseChartData {
  income: number[];
  expense: number[];
}

type TimePeriod = 'daily' | 'weekly' | 'monthly';

export interface IIncomeExpenseStatisticWidget {
  height?: string;
  name: string;
  chartData: IncomeExpenseChartData,
  timeRange: TimePeriod
}

@Component({
  selector: 'app-income-expense-statistic-widget',
  imports: [
    CommonModule,
    FormsModule,
    VerticalDivider,
    SegmentedButton,
    Segmented
  ],
  templateUrl: './income-expense-statistic-widget.html',
  styleUrl: './income-expense-statistic-widget.scss',
  host: {
    class: 'widget-container'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeExpenseStatisticWidget implements OnInit, AfterViewInit, OnDestroy {
  readonly chartContainer = viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');

  private chartInstance: echarts.ECharts | null = null;
  private resizeObserver: ResizeObserver | null = null;

  readonly id = input<any>();
  readonly widget = input.required<IIncomeExpenseStatisticWidget>();

  readonly timeRange = model('weekly');

  private incomeData = signal<number[]>([]);
  private expenseData = signal<number[]>([]);

  totalIncome = computed(() => {
    return this.widget().chartData.income.reduce((sum, val) => sum + val, 0) || 0;
  });

  totalExpense = computed(() => {
    return this.widget().chartData.expense.reduce((sum, val) => sum + val, 0) || 0;
  });

  public readonly timePeriods = signal<{ name: string; type: TimePeriod }[]>([
    {
      name: 'Daily',
      type: 'daily'
    },
    {
      name: 'Weekly',
      type: 'weekly'
    },
    {
      name: 'Monthly',
      type: 'monthly'
    }
  ]);

  constructor() {
    effect(() => {
      this.generateChartData(this.timeRange());
      this.updateChart();
    });
  }

  ngOnInit() {
    if (this.widget().height) {
      this.chartContainer().nativeElement.style.setProperty('--chart-height', this.widget().height as string);
    }

    this.timeRange.set(this.widget().timeRange);
  }

  ngAfterViewInit(): void {
    this.initChart();
    this.setupResizeObserver();
  }

  ngOnDestroy(): void {
    this.disposeChart();
    this.disconnectResizeObserver();
  }

  private initChart(): void {
    if (!this.chartContainer) {
      return;
    }

    this.chartInstance = echarts.init(this.chartContainer().nativeElement);
    this.generateChartData(this.timeRange());
    this.updateChart();
  }

  private generateChartData(range: string): void {
    const days = this.getDaysForRange(range);

    const incomeData = days.map(() => Math.floor(Math.random() * 800) + 200);
    const expenseData = days.map(() => Math.floor(Math.random() * 600) + 100);

    this.incomeData.set(incomeData);
    this.expenseData.set(expenseData);
  }

  private getDaysForRange(range: string): string[] {
    switch (range) {
      case 'Daily':
        return ['12AM', '4AM', '8AM', '12PM', '4PM', '8PM'];
      case 'Weekly':
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      case 'Monthly':
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      default:
        return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    }
  }

  private updateChart(): void {
    if (!this.chartInstance) return;

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: (params: any) => {
          let result = params[0].axisValue + '<br/>';

          params.forEach((param: any) => {
            const value = '$' + param.value.toLocaleString();
            result += `${param.marker}${param.seriesName}: <strong>${value}</strong><br/>`;
          });

          return result;
        }
      },
      legend: {
        data: ['Income', 'Expense'],
        bottom: '0'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '20%',
        top: '5%',
      },
      xAxis: {
        type: 'category',
        data: this.getDaysForRange(this.timeRange())
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 1000
      },
      series: [
        {
          name: 'Income',
          type: 'bar',
          data: this.incomeData(),
          itemStyle: {
            borderRadius: 15
          }
        },
        {
          name: 'Expense',
          type: 'bar',
          data: this.expenseData(),
          itemStyle: {
            borderRadius: 15
          }
        }
      ]
    };

    this.chartInstance.setOption(option);
  }

  private setupResizeObserver(): void {
    this.resizeObserver = new ResizeObserver(() => {
      if (this.chartInstance) {
        this.chartInstance.resize();
      }
    });

    if (this.chartContainer().nativeElement) {
      this.resizeObserver.observe(this.chartContainer().nativeElement);
    }
  }

  private disconnectResizeObserver(): void {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  private disposeChart(): void {
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
  }
}
