import {
  afterNextRender,
  Component,
  computed,
  ElementRef,
  OnDestroy,
  signal,
  untracked,
  viewChild
} from '@angular/core';
import { ECharts, EChartsOption, init } from 'echarts';

@Component({
  selector: 'app-card-balance-widget',
  imports: [],
  templateUrl: './card-balance-widget.html',
  styleUrl: './card-balance-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class CardBalanceWidget implements OnDestroy {
  private readonly chartContainer = viewChild.required<ElementRef<HTMLDivElement>>('chartContainer');

  private readonly rawData = signal<number[]>([
    15800, 16300, 16000, 15200, 14900, 15500, 15700, 17000, 16500,
    16200, 16000, 15500, 16300, 15900, 14800, 15200, 15300, 15500,
    15400, 15000
  ]);

  private readonly chartOption = computed<EChartsOption>(() => ({
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'],
    },
    yAxis: {
      type: 'value',
      min: 14000,
      max: 17000,
      axisLabel: { formatter: (value: number) => `${value / 1000}k` },
      splitLine: { lineStyle: { type: 'dotted' } },
    },
    series: [{
      name: 'Balance',
      type: 'line',
      smooth: false,
      symbol: 'none',
      data: this.rawData(),
      lineStyle: { color: 'red' },
    }],
    grid: {
      top: '5%',
      left: '3%',
      right: '4%',
      bottom: '7%',
      containLabel: true,
    },
  }));

  private chartInstance: ECharts | null = null;

  constructor() {
    afterNextRender(() => {
      untracked(() => {
        const element = this.chartContainer().nativeElement;
        this.chartInstance = init(element);
        this.chartInstance.setOption(this.chartOption());
      });
    });
  }

  ngOnDestroy(): void {
    this.chartInstance?.dispose();
  }
}
