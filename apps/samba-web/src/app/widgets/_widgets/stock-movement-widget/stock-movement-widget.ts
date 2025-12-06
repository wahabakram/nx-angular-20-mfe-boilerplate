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
import { BarChart } from 'echarts/charts';
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import { Dashboard, DASHBOARD, WidgetItem } from '@ng-mf/components';

use([TooltipComponent, GridComponent, LegendComponent, BarChart, CanvasRenderer]);

interface StockMovementData {
  month: string;
  stockIn: number;
  stockOut: number;
}

@Component({
  selector: 'app-stock-movement-widget',
  imports: [],
  templateUrl: './stock-movement-widget.html',
  styleUrl: './stock-movement-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'widget-container'
  },
})
export class StockMovementWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<WidgetItem>();

  // Mock data - replace with real data from service
  movementData = signal<StockMovementData[]>([
    { month: 'Jan', stockIn: 85, stockOut: 62 },
    { month: 'Feb', stockIn: 92, stockOut: 78 },
    { month: 'Mar', stockIn: 78, stockOut: 85 },
    { month: 'Apr', stockIn: 105, stockOut: 92 },
    { month: 'May', stockIn: 88, stockOut: 76 },
    { month: 'Jun', stockIn: 95, stockOut: 88 },
  ]);

  private readonly chartContainer = viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');

  private readonly chartOptions = computed<EChartsOption>(() => {
    const data = this.movementData();
    const months = data.map(item => item.month);
    const stockIn = data.map(item => item.stockIn);
    const stockOut = data.map(item => item.stockOut);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: ['Stock In', 'Stock Out'],
        top: 0,
        textStyle: { fontSize: 12 }
      },
      grid: {
        top: '15%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: { fontSize: 12 },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLabel: { fontSize: 12 },
        splitLine: { lineStyle: { type: 'dashed', opacity: 0.3 } }
      },
      series: [
        {
          name: 'Stock In',
          type: 'bar',
          barWidth: '35%',
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: '#10B981'
          },
          data: stockIn
        },
        {
          name: 'Stock Out',
          type: 'bar',
          barWidth: '35%',
          itemStyle: {
            borderRadius: [8, 8, 0, 0],
            color: '#EF4444'
          },
          data: stockOut
        }
      ],
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
