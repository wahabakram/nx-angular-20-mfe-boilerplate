import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  viewChild, model, numberAttribute,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts/core';
import type { EChartsOption, SeriesOption } from 'echarts';
import {
  subMonths, addMonths, startOfMonth, format,
  subDays, addDays,
  subWeeks, startOfWeek,
  differenceInCalendarMonths,
  differenceInCalendarDays,
  differenceInCalendarISOWeeks
} from 'date-fns';
import { SegmentedButton, Segmented } from '@ng-mf/components';
import { FormsModule } from '@angular/forms';

export type ChartDataPoint = { date: Date; value: number };
export type AggregatedDataPoint = { value: number; labelValue: number };

export type ChartSeries<T> = {
  name: string;
  color: string;
  data: T[];
  isActive: boolean;
};

type TimePeriod = 'year' | 'month' | 'week';

@Component({
  selector: 'app-transactions-overview-widget',
  imports: [
    CommonModule,
    SegmentedButton,
    Segmented,
    FormsModule
  ],
  templateUrl: './transactions-overview-widget.html',
  styleUrls: ['./transactions-overview-widget.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'widget-container'
  }
})
export class TransactionsOverviewWidget {
  private readonly chartContainer = viewChild.required<ElementRef>('chartContainer');
  private readonly hostElement = inject(ElementRef).nativeElement as HTMLElement;
  private chart?: echarts.ECharts;
  private resizeObserver: ResizeObserver;

  public readonly datasets = input.required<ChartSeries<ChartDataPoint>[]>({ alias: 'chartDatasets' });
  readonly earningValue = input.required({
    transform: numberAttribute
  });
  readonly widgetName = input.required();

  public readonly internalDatasets = signal<ChartSeries<ChartDataPoint>[]>([]);
  public readonly selectedPeriod = model<TimePeriod>('year');
  public readonly timePeriod = input.required<TimePeriod>();
  public readonly timePeriods = signal<{ name: string; type: TimePeriod }[]>([
    {
      name: 'Year',
      type: 'year'
    },
    {
      name: 'Month',
      type: 'month'
    },
    {
      name: 'Week',
      type: 'week'
    },
  ]);

  private readonly aggregatedData = computed(() => this.aggregateDataByPeriod(this.internalDatasets(), this.selectedPeriod()));
  private readonly xAxisLabels = computed(() => this.getXAxisLabels(this.selectedPeriod()));
  public readonly chartOptions = computed(() => this.getChartOptions());

  constructor() {
    this.resizeObserver = new ResizeObserver(() => this.chart?.resize());

    effect(() => {
      this.selectedPeriod.set(this.timePeriod());
    });

    effect(() => this.internalDatasets.set(this.datasets()));

    effect(() => {
      const chartInstance = this.chart ?? echarts.init(this.chartContainer().nativeElement);
      this.chart = chartInstance;
      chartInstance.setOption(this.chartOptions(), { notMerge: true });
      this.resizeObserver.observe(this.hostElement);
      return () => {
        this.resizeObserver.disconnect();
        chartInstance.dispose();
      };
    });
  }

  public setPeriod(period: TimePeriod): void {
    this.selectedPeriod.set(period);
  }

  public toggleSeriesVisibility(seriesName: string): void {
    this.internalDatasets.update(current =>
      current.map(s => ({ ...s, isActive: s.name === seriesName }))
    );
  }

  private getChartOptions(): EChartsOption {
    return {
      grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
      tooltip: {
        trigger: 'axis', axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => (params as { seriesName: string; data: AggregatedDataPoint; marker: string }[])
          .map(p => `${p.marker}${p.seriesName}: <b>$${p.data.value.toLocaleString()}</b>`).join('<br/>'),
        backgroundColor: '#111827', textStyle: { color: '#F9FAFB' },
      },
      xAxis: [{
        type: 'category', data: this.xAxisLabels(), axisTick: { alignWithLabel: true },
        axisLine: { show: false }, axisLabel: { color: '#6B7280' },
      }],
      yAxis: [{
        type: 'value',
        axisLabel: { formatter: (v: number) => (v === 0 ? '0k' : `${v / 1000}k`), color: '#6B7280' },
        splitLine: { lineStyle: { type: 'dashed', color: '#E5E7EB' } },
      }],
      series: this.getSeriesData(),
    };
  }

  private getSeriesData(): SeriesOption[] {
    const stripedPattern = { image: this.createStripes(), repeat: 'repeat' } as const;
    const aggregated = this.aggregatedData();

    return aggregated.filter(d => d.isActive).map(series => ({
      name: series.name, type: 'bar', barWidth: '60%', z: 10, clip: false,
      itemStyle: { color: stripedPattern, opacity: 0.5, borderRadius: [5, 5, 0, 0] },
      emphasis: {
        itemStyle: { color: series.color, opacity: 1 },
        label: {
          opacity: 1,
          show: true, position: 'top', backgroundColor: series.color, color: '#fff',
          borderRadius: 5, padding: [5, 10], offset: [0, -5],
          formatter: (p: unknown) => `$${(p as { data: AggregatedDataPoint }).data.labelValue.toLocaleString()}`
        },
      },
      data: series.data,
    }));
  }

  private aggregateDataByPeriod(series: ChartSeries<ChartDataPoint>[], period: TimePeriod): ChartSeries<AggregatedDataPoint>[] {
    const now = new Date();
    return series.map(s => {
      let aggregated: AggregatedDataPoint[] = [];
      let startDate: Date;
      let endDate: Date = now;

      switch (period) {
        case 'year':
          startDate = startOfMonth(subMonths(now, 11));
          aggregated = Array.from({ length: 12 }, () => ({ value: 0, labelValue: 0 }));
          s.data.filter(dp => dp.date >= startDate && dp.date <= endDate).forEach(dp => {
            const monthIndex = differenceInCalendarMonths(dp.date, startDate);
            if (aggregated[monthIndex]) {
              aggregated[monthIndex].value += dp.value;
              aggregated[monthIndex].labelValue += dp.value;
            }
          });
          break;
        case 'month':
          startDate = startOfWeek(subWeeks(now, 3), { weekStartsOn: 1 });
          aggregated = Array.from({ length: 4 }, () => ({ value: 0, labelValue: 0 }));
          s.data.filter(dp => dp.date >= startDate && dp.date <= endDate).forEach(dp => {
            const weekIndex = differenceInCalendarISOWeeks(dp.date, startDate);
            if (aggregated[weekIndex]) {
              aggregated[weekIndex].value += dp.value;
              aggregated[weekIndex].labelValue += dp.value;
            }
          });
          break;
        case 'week':
          startDate = subDays(now, 6);
          aggregated = Array.from({ length: 7 }, () => ({ value: 0, labelValue: 0 }));
          s.data.filter(dp => dp.date >= startDate && dp.date <= endDate).forEach(dp => {
            const dayIndex = differenceInCalendarDays(dp.date, startDate);
            if (aggregated[dayIndex]) {
              aggregated[dayIndex].value += dp.value;
              aggregated[dayIndex].labelValue += dp.value;
            }
          });
          break;
      }
      return { ...s, data: aggregated };
    });
  }

  private getXAxisLabels(period: TimePeriod): string[] {
    const now = new Date();
    switch(period) {
      case 'year':
        const firstMonth = startOfMonth(subMonths(now, 11));
        return Array.from({ length: 12 }).map((_, i) => format(addMonths(firstMonth, i), 'MMM'));
      case 'month':
        return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      case 'week':
        const firstDay = subDays(now, 6);
        return Array.from({ length: 7 }).map((_, i) => format(addDays(firstDay, i), 'E'));
      default: return [];
    }
  }

  private createStripes(): HTMLCanvasElement {
    const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
    canvas.width = 10; canvas.height = 10;
    if (ctx) {
      ctx.fillStyle = '#f3f4f6'; ctx.fillRect(0, 0, 10, 10);
      ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(10, 0); ctx.stroke();
    }
    return canvas;
  }
}
