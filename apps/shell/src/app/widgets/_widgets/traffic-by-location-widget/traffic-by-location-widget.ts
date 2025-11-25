import {
  Component,
  ElementRef,
  effect,
  viewChild,
  input,
  computed,
} from '@angular/core';
import * as echarts from 'echarts';
import { EChartsOption, ECharts, SeriesOption } from 'echarts';

export interface ITrafficByLocationWidget {
  id: string;
  name: string;
  data: TrafficByLocationData[];
}

export interface TrafficByLocationData {
  name: string;
  value: number;
  color?: string | object;
}

@Component({
  selector: 'app-traffic-by-location-widget',
  imports: [],
  templateUrl: './traffic-by-location-widget.html',
  styleUrl: './traffic-by-location-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class TrafficByLocationWidget {
  readonly widget = input.required<ITrafficByLocationWidget>();

  private chartContainer = viewChild.required<ElementRef>('chartContainer');
  private chartInstance?: ECharts;

  private chartOptions = computed<EChartsOption>(() => {
    const chartData = this.widget().data;
    const legendData = chartData.map((item: any) => item.name);

    const seriesData: SeriesOption = {
      name: this.widget().name,
      type: 'pie',
      radius: ['50%', '80%'],
      center: ['30%', '50%'],
      avoidLabelOverlap: false,
      label: { show: false },
      labelLine: { show: false },
      itemStyle: {
        borderWidth: 5,
        borderColor: '#fff',
        borderRadius: 10
      },
      data: chartData.map((item: any) => ({
        name: item.name,
        value: item.value,
        itemStyle: {
          color: item.color,
        },
      })),
    };

    return {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        top: 'middle',
        right: '10%',
        itemGap: 25,
        data: legendData,
        textStyle: { fontSize: 16 },
        icon: 'circle',
        formatter: (name: string) => {
          const item = chartData.find(d => d.name === name);
          if (item) {
            return `${name} ${item.value}%`;
          }
          return name;
        },
      },
      series: [seriesData],
    };
  });

  constructor() {
    effect(() => {
      const chartContainerEl = this.chartContainer().nativeElement;
      const options = this.chartOptions();

      if (!this.chartInstance) {
        this.chartInstance = echarts.init(chartContainerEl);
      }

      this.chartInstance.setOption(options);
    });
  }

  ngOnDestroy(): void {
    this.chartInstance?.dispose();
  }
}
