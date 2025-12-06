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
import { TooltipComponent, GridComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import { Dashboard, DASHBOARD, WidgetItem } from '@ng-mf/components';

use([TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

interface ProductData {
  name: string;
  sales: number;
}

@Component({
  selector: 'app-top-products-widget',
  imports: [],
  templateUrl: './top-products-widget.html',
  styleUrl: './top-products-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'widget-container'
  },
})
export class TopProductsWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<WidgetItem>();

  // Mock data - replace with real data from service
  productData = signal<ProductData[]>([
    { name: 'Wireless Mouse', sales: 245 },
    { name: 'USB-C Cable', sales: 198 },
    { name: 'Keyboard', sales: 156 },
    { name: 'Headphones', sales: 142 },
    { name: 'Monitor Stand', sales: 98 },
  ]);

  private readonly chartContainer = viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');

  private readonly chartOptions = computed<EChartsOption>(() => {
    const data = this.productData();
    const products = data.map(item => item.name);
    const values = data.map(item => item.sales);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          const param = params[0];
          return `${param.name}<br/>Sales: ${param.value} units`;
        }
      },
      grid: {
        top: '5%',
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLabel: { fontSize: 12 },
        splitLine: { lineStyle: { type: 'dashed', opacity: 0.3 } }
      },
      yAxis: {
        type: 'category',
        data: products,
        axisLabel: { fontSize: 12 },
        axisLine: { show: false },
        axisTick: { show: false }
      },
      series: [{
        name: 'Sales',
        type: 'bar',
        barWidth: '50%',
        itemStyle: {
          borderRadius: [0, 8, 8, 0],
          color: (params) => {
            const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
            return colors[params.dataIndex as number] ?? '#ccc';
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
