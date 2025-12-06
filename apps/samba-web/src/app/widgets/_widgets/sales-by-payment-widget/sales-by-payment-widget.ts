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
import { PieChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import { Dashboard, DASHBOARD, WidgetItem } from '@ng-mf/components';

use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

interface PaymentMethodData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-sales-by-payment-widget',
  imports: [],
  templateUrl: './sales-by-payment-widget.html',
  styleUrl: './sales-by-payment-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'widget-container'
  },
})
export class SalesByPaymentWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<WidgetItem>();

  // Mock data - replace with real data from service
  paymentData = signal<PaymentMethodData[]>([
    { name: 'Cash', value: 850000 },
    { name: 'UPI', value: 1200000 },
    { name: 'Card', value: 650000 },
    { name: 'Wallet', value: 147500 },
  ]);

  private readonly chartContainer = viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');

  private readonly chartOptions = computed<EChartsOption>(() => {
    const data = this.paymentData();

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          return `${params.name}<br/>₹${params.value.toLocaleString()} (${params.percent}%)`;
        }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        textStyle: { fontSize: 12 }
      },
      series: [{
        name: 'Payment Method',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['65%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 18,
            fontWeight: 'bold',
            formatter: (params: any) => {
              return `${params.name}\n₹${(params.value / 1000).toFixed(0)}k`;
            }
          }
        },
        labelLine: {
          show: false
        },
        data: data.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'][index]
          }
        }))
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
