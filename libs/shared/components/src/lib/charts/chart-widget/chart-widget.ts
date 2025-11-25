import { MatDividerModule } from '@angular/material/divider';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  signal,
  computed,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

// import echarts core
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts/core';
// import necessary echarts components
import {
  BarChart,
  FunnelChart,
  GaugeChart,
  LineChart,
  PieChart,
} from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import {
  NgxEchartsDirective,
  NgxEchartsModule,
  provideEchartsCore,
} from 'ngx-echarts';

echarts.use([
  BarChart,
  GridComponent,
  CanvasRenderer,
  TooltipComponent,
  LegendComponent,
  LineChart,
  GaugeChart,
  PieChart,
  FunnelChart,
]);

export interface ChartDataItem {
  label?: string;
  name?: string;
  value?: number;
  x?: number;
  y?: number;
  value2?: number;
  max?: number;
}

export interface ChartWidgetConfig {
  id: string;
  title: string;
  description?: string;
  type:
    | 'line'
    | 'bar'
    | 'pie'
    | 'area'
    | 'scatter'
    | 'gauge'
    | 'funnel'
    | 'radar';
  data: ChartDataItem[];
  options?: Partial<EChartsOption>;
  height?: number;
  width?: string;
  showHeader?: boolean;
  showMenu?: boolean;
  refreshable?: boolean;
  exportable?: boolean;
  loading?: boolean;
}

@Component({
  selector: 'mf-chart-widget',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    NgxEchartsModule,
    MatDividerModule,
    NgxEchartsDirective,
  ],
  templateUrl: './chart-widget.html',
  styleUrl: './chart-widget.scss',
  providers: [provideEchartsCore({ echarts })],
})
export class ChartWidget implements OnInit, OnDestroy {
  config = input<ChartWidgetConfig>({
    id: '',
    title: '',
    type: 'line',
    data: [],
  });

  @ViewChild('chartContainer', { static: false }) chartContainer?: ElementRef;

  private isLoadingState = signal(false);
  private hasErrorState = signal(false);

  isLoading = computed(() => this.config().loading || this.isLoadingState());
  hasError = computed(() => this.hasErrorState());

  chartOptions = computed(() => {
    const config = this.config();
    if (!config.data || config.data.length === 0) {
      return this.getEmptyChartOptions();
    }

    return this.generateChartOptions(config);
  });

  ngOnInit() {
    // Initialize chart if data is available
    if (this.config().data?.length > 0) {
      this.updateChart();
    }
  }

  ngOnDestroy() {
    // Cleanup chart instance if needed
    this.chartContainer = undefined;
  }

  private generateChartOptions(config: ChartWidgetConfig): EChartsOption {
    const baseOptions: EChartsOption = {
      responsive: true,
      animation: true,
      grid: {
        top: 60,
        left: 60,
        right: 40,
        bottom: 60,
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: '#333',
        textStyle: {
          color: '#fff',
        },
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
      },
      legend: {
        top: 10,
        left: 'center',
        textStyle: {
          color: '#666',
        },
      },
      ...config.options,
    };

    switch (config.type) {
      case 'line':
        return this.generateLineChartOptions(config, baseOptions);
      case 'bar':
        return this.generateBarChartOptions(config, baseOptions);
      case 'pie':
        return this.generatePieChartOptions(config, baseOptions);
      case 'area':
        return this.generateAreaChartOptions(config, baseOptions);
      case 'scatter':
        return this.generateScatterChartOptions(config, baseOptions);
      case 'gauge':
        return this.generateGaugeChartOptions(config, baseOptions);
      case 'funnel':
        return this.generateFunnelChartOptions(config, baseOptions);
      case 'radar':
        return this.generateRadarChartOptions(config, baseOptions);
      default:
        return this.generateLineChartOptions(config, baseOptions);
    }
  }

  private generateLineChartOptions(
    config: ChartWidgetConfig,
    baseOptions: EChartsOption
  ): EChartsOption {
    const data = config.data;
    return {
      ...baseOptions,
      xAxis: {
        type: 'category',
        data: data.map((item) => item.label || item.name || item.x || ''),
        axisLine: {
          lineStyle: {
            color: '#e0e0e0',
          },
        },
        axisLabel: {
          color: '#666',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#e0e0e0',
          },
        },
        axisLabel: {
          color: '#666',
        },
        splitLine: {
          lineStyle: {
            color: '#f5f5f5',
          },
        },
      },
      series: [
        {
          type: 'line',
          data: data.map((item) => item.value || item.y || 0),
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: '#2196F3',
          },
          itemStyle: {
            color: '#2196F3',
            borderColor: '#fff',
            borderWidth: 2,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(33, 150, 243, 0.3)' },
                { offset: 1, color: 'rgba(33, 150, 243, 0.05)' },
              ],
            },
          },
        },
      ],
    };
  }

  private generateBarChartOptions(
    config: ChartWidgetConfig,
    baseOptions: EChartsOption
  ): EChartsOption {
    const data = config.data;
    return {
      ...baseOptions,
      xAxis: {
        type: 'category',
        data: data.map((item) => item.label || item.name || item.x || ''),
        axisLine: {
          lineStyle: {
            color: '#e0e0e0',
          },
        },
        axisLabel: {
          color: '#666',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#e0e0e0',
          },
        },
        axisLabel: {
          color: '#666',
        },
        splitLine: {
          lineStyle: {
            color: '#f5f5f5',
          },
        },
      },
      series: [
        {
          type: 'bar',
          data: data.map((item) => item.value || item.y || 0),
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: '#4CAF50' },
                { offset: 1, color: '#2E7D32' },
              ],
            },
            borderRadius: [4, 4, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: '#66BB6A',
            },
          },
        },
      ],
    };
  }

  private generatePieChartOptions(
    config: ChartWidgetConfig,
    baseOptions: EChartsOption
  ): EChartsOption {
    const data = config.data;
    return {
      ...baseOptions,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      series: [
        {
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          data: data.map((item, index) => ({
            name: item.label || item.name || '',
            value: item.value || item.y || 0,
            itemStyle: {
              color: this.getColorByIndex(index),
            },
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          label: {
            show: true,
            formatter: '{b}: {d}%',
          },
        },
      ],
    };
  }

  private generateAreaChartOptions(
    config: ChartWidgetConfig,
    baseOptions: EChartsOption
  ): EChartsOption {
    const data = config.data;
    return {
      ...baseOptions,
      xAxis: {
        type: 'category',
        data: data.map((item) => item.label || item.name || item.x || ''),
        axisLine: {
          lineStyle: {
            color: '#e0e0e0',
          },
        },
        axisLabel: {
          color: '#666',
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#e0e0e0',
          },
        },
        axisLabel: {
          color: '#666',
        },
        splitLine: {
          lineStyle: {
            color: '#f5f5f5',
          },
        },
      },
      series: [
        {
          type: 'line',
          data: data.map((item) => item.value || item.y || 0),
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 152, 0, 0.6)' },
                { offset: 1, color: 'rgba(255, 152, 0, 0.1)' },
              ],
            },
          },
          lineStyle: {
            width: 0,
          },
          symbol: 'none',
        },
      ],
    };
  }

  private generateScatterChartOptions(
    config: ChartWidgetConfig,
    baseOptions: EChartsOption
  ): EChartsOption {
    const data = config.data;
    return {
      ...baseOptions,
      xAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#e0e0e0',
          },
        },
        axisLabel: {
          color: '#666',
        },
        splitLine: {
          lineStyle: {
            color: '#f5f5f5',
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          lineStyle: {
            color: '#e0e0e0',
          },
        },
        axisLabel: {
          color: '#666',
        },
        splitLine: {
          lineStyle: {
            color: '#f5f5f5',
          },
        },
      },
      series: [
        {
          type: 'scatter',
          data: data.map((item) => [
            item.x || item.value || 0,
            item.y || item.value2 || 0,
          ]),
          symbolSize: 8,
          itemStyle: {
            color: '#9C27B0',
            opacity: 0.8,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(156, 39, 176, 0.5)',
            },
          },
        },
      ],
    };
  }

  private generateGaugeChartOptions(
    config: ChartWidgetConfig,
    baseOptions: EChartsOption
  ): EChartsOption {
    const dataItem = config.data[0] || { value: 0, max: 100 };
    return {
      ...baseOptions,
      series: [
        {
          type: 'gauge',
          center: ['50%', '60%'],
          startAngle: 200,
          endAngle: -40,
          min: 0,
          max: dataItem.max || 100,
          splitNumber: 5,
          itemStyle: {
            color: '#FF6B6B',
          },
          progress: {
            show: true,
            width: 15,
            itemStyle: {
              color: '#4ECDC4',
            },
          },
          pointer: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              width: 15,
              color: [[1, '#f0f0f0']],
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          detail: {
            valueAnimation: true,
            formatter: '{value}%',
            fontSize: 24,
            fontWeight: 'bold',
            offsetCenter: [0, '20%'],
          },
          data: [{ value: dataItem.value || 0 }],
        },
      ],
    };
  }

  private generateFunnelChartOptions(
    config: ChartWidgetConfig,
    baseOptions: EChartsOption
  ): EChartsOption {
    const data = config.data;
    return {
      ...baseOptions,
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      series: [
        {
          type: 'funnel',
          left: '10%',
          top: 60,
          bottom: 60,
          width: '80%',
          min: 0,
          max: Math.max(...data.map((item) => item.value || 0)),
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside',
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid',
            },
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1,
          },
          emphasis: {
            label: {
              fontSize: 20,
            },
          },
          data: data.map((item, index) => ({
            name: item.label || item.name || '',
            value: item.value || 0,
            itemStyle: {
              color: this.getColorByIndex(index),
            },
          })),
        },
      ],
    };
  }

  private generateRadarChartOptions(
    config: ChartWidgetConfig,
    baseOptions: EChartsOption
  ): EChartsOption {
    const data = config.data;
    const indicators = data.map((item) => ({
      name: item.label || item.name || '',
      max: item.max || 100,
    }));

    return {
      ...baseOptions,
      radar: {
        indicator: indicators,
        radius: '70%',
        axisName: {
          color: '#666',
        },
        splitLine: {
          lineStyle: {
            color: '#e0e0e0',
          },
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(250, 250, 250, 0.3)', 'rgba(200, 200, 200, 0.3)'],
          },
        },
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: data.map((item) => item.value || 0),
              areaStyle: {
                color: 'rgba(63, 81, 181, 0.3)',
              },
              lineStyle: {
                color: '#3F51B5',
                width: 2,
              },
              itemStyle: {
                color: '#3F51B5',
              },
            },
          ],
        },
      ],
    };
  }

  private getEmptyChartOptions(): EChartsOption {
    return {
      graphic: {
        type: 'text',
        left: 'center',
        top: 'middle',
        style: {
          text: 'No data available',
          fontSize: 16,
          fill: '#999',
        },
      },
    };
  }

  private getColorByIndex(index: number): string {
    const colors = [
      '#2196F3',
      '#4CAF50',
      '#FF9800',
      '#9C27B0',
      '#F44336',
      '#00BCD4',
      '#FFEB3B',
      '#795548',
      '#607D8B',
      '#E91E63',
    ];
    return colors[index % colors.length];
  }

  private updateChart(): void {
    // Chart update logic if needed
  }

  onRefresh(): void {
    this.isLoadingState.set(true);
    this.hasErrorState.set(false);

    // Simulate refresh delay
    setTimeout(() => {
      this.isLoadingState.set(false);
      // Emit refresh event or call refresh callback
    }, 1000);
  }

  onExportPNG(): void {
    // Export as PNG implementation
    console.log('Export as PNG');
  }

  onExportJPG(): void {
    // Export as JPG implementation
    console.log('Export as JPG');
  }

  onExportSVG(): void {
    // Export as SVG implementation
    console.log('Export as SVG');
  }

  onFullscreen(): void {
    // Fullscreen implementation
    console.log('Toggle fullscreen');
  }
}
