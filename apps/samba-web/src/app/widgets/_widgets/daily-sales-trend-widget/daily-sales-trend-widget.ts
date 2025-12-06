import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  viewChild,
  OnInit,
  signal
} from '@angular/core';
import { init, use } from 'echarts/core';
import { LineChart } from 'echarts/charts';
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import { Dashboard, DASHBOARD, WidgetItem } from '@ng-mf/components';

use([TooltipComponent, GridComponent, LegendComponent, LineChart, CanvasRenderer]);

interface DailySalesData {
  date: string;
  sales: number;
}

@Component({
  selector: 'app-daily-sales-trend-widget',
  imports: [],
  templateUrl: './daily-sales-trend-widget.html',
  styleUrl: './daily-sales-trend-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'widget-container'
  },
})
export class DailySalesTrendWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<WidgetItem>();

  // Mock data - replace with real data from service
  salesData = signal<DailySalesData[]>([
    { date: '2024-12-01', sales: 12500 },
    { date: '2024-12-02', sales: 15300 },
    { date: '2024-12-03', sales: 11800 },
    { date: '2024-12-04', sales: 18200 },
    { date: '2024-12-05', sales: 16900 },
    { date: '2024-12-06', sales: 19500 },
    { date: '2024-12-07', sales: 21300 },
  ]);

  private readonly chartContainer = viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');

  private readonly chartOptions = computed<EChartsOption>(() => {
    const data = this.salesData();
    const dates = data.map(item => item.date);
    const values = data.map(item => item.sales);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' },
        formatter: (params: any) => {
          const param = params[0];
          return `${param.name}<br/>Sales: ₹${param.value.toLocaleString()}`;
        }
      },
      grid: {
        top: '10%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        boundaryGap: false,
        axisLabel: { fontSize: 12 },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: (value: number) => `₹${(value / 1000).toFixed(0)}k`,
          fontSize: 12
        },
        splitLine: { lineStyle: { type: 'dashed', opacity: 0.3 } }
      },
      series: [{
        name: 'Sales',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#3B82F6'
        },
        itemStyle: {
          color: '#3B82F6',
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
            ]
          }
        },
        data: values
      }],
    };
  });

  private chart!: any;
  private resizeObserver?: ResizeObserver;
  private readonly destroyer = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.init();
    });

    this.destroyer.onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.chart?.dispose();
    });
  }

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
    this.init();
  }

  private init() {
    const element = this.chartContainer().nativeElement;
    const options = this.chartOptions();

    if (!this.chart) {
      this.chart = init(element);

      this.resizeObserver = new ResizeObserver(() => {
        this.chart?.resize();
      });
      this.resizeObserver.observe(element);
    }

    this.chart.setOption(options);
  }
}
