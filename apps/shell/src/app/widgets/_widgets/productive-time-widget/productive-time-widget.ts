import {
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  signal
} from '@angular/core';
import { ECharts, EChartsOption, init } from 'echarts';

@Component({
  selector: 'app-productive-time-widget',
  imports: [],
  templateUrl: './productive-time-widget.html',
  styleUrl: './productive-time-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class ProductiveTimeWidget implements AfterViewInit, OnDestroy {
  public readonly hours = input.required<number>();
  public readonly percentageChange = input.required<number>();
  public readonly data = input.required<number[]>();

  private readonly elementRef = inject(ElementRef<HTMLElement>);

  private chartInstance = signal<ECharts | null>(null);
  private resizeObserver: ResizeObserver | null = null;

  private readonly chartOption = computed<EChartsOption>(() => {
    const data = this.data();

    const options: EChartsOption = {
      grid: { left: 0, right: 5, top: 10, bottom: 5 },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#adb5bd',
            width: 1.5,
            type: 'dashed'
          }
        },
        formatter: (params: unknown) => {
          if (Array.isArray(params) && params.length > 0) {
            const dataPoint = params[0] as { value: number };
            return `<strong>${dataPoint.value} hr</strong>`;
          }
          return '';
        },
        backgroundColor: '#fff',
        borderColor: '#dee2e6',
        borderWidth: 1,
        textStyle: {
          color: '#212529'
        },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); border-radius: 8px; padding: 8px 12px;'
      },
      xAxis: { type: 'category', show: false, boundaryGap: false },
      yAxis: { type: 'value', show: false },
      series: [
        {
          type: 'line',
          data: data,
          smooth: true,
          symbol: 'none',
          lineStyle: { color: '#4A55A2', width: 3 },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(74, 85, 162, 0.2)' },
                { offset: 1, color: 'rgba(74, 85, 162, 0)' },
              ],
            },
          },
        },
      ],
    };

    return options;
  });

  constructor() {
    effect(() => {
      const chart = this.chartInstance();
      if (chart) {
        chart.setOption(this.chartOption());
      }
    });
  }

  ngAfterViewInit(): void {
    const chartContainer = this.elementRef.nativeElement.querySelector('.chart-wrapper');

    if (chartContainer instanceof HTMLElement) {
      const chart = init(chartContainer);
      this.chartInstance.set(chart);

      this.resizeObserver = new ResizeObserver(() => {
        setTimeout(() => this.chartInstance()?.resize(), 0);
      });

      this.resizeObserver.observe(chartContainer);
    }
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.chartInstance()?.dispose();
  }
}
