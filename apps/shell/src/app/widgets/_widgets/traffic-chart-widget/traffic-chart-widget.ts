import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  viewChild, OnInit,
} from '@angular/core';
import { init, use } from 'echarts/core';
import { BarChart } from 'echarts/charts';
import { TooltipComponent, GridComponent, TitleComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';

use([TitleComponent, TooltipComponent, GridComponent, BarChart, CanvasRenderer]);

@Component({
  selector: 'app-traffic-chart-widget',
  imports: [],
  templateUrl: './traffic-chart-widget.html',
  styleUrl: './traffic-chart-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'widget-container'
  },
})
export class TrafficChartWidget implements OnInit {
  trafficData = input.required<Array<[string, number]>>();

  private readonly chartContainer = viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');

  private readonly chartOptions = computed<EChartsOption>(() => {
    const data = this.trafficData();
    const categories = data.map(item => item[0]);
    const values = data.map(item => item[1]);

    return {
      tooltip: {trigger: 'axis', axisPointer: {type: 'shadow'}},
      grid: {
        top: '5%',
        left: '3%',
        right: '1%',
        bottom: '3%',
        containLabel: false
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisTick: {alignWithLabel: true},
        axisLabel: {fontSize: 14},
        axisLine: {show: false}
      },
      yAxis: {
        type: 'value',
        axisLabel: {formatter: '{value}K', fontSize: 14},
        splitLine: { show: false, lineStyle: {type: 'dotted'}}
      },
      series: [{
        name: 'Traffic',
        type: 'bar',
        barWidth: '35%',
        itemStyle: {
          borderRadius: [12, 12, 12, 12],
          color: (params) => {
            const colors = ['#EF4444', '#8B5CF6', '#6B7280', '#3B82F6', '#06B6D4', '#D1D5DB'];
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
