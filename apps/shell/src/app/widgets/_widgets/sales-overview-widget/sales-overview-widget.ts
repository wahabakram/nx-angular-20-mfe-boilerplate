import { Component, computed, effect, ElementRef, inject, input, LOCALE_ID, signal, viewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import * as echarts from 'echarts/core';
import { GaugeChart, GaugeSeriesOption } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { ECharts, getInstanceByDom, init } from 'echarts/core';
import { EChartsOption } from 'echarts';
import { GlobalStore, ThemeManager } from '@ng-mf/components';
import { ColorSchemeStore } from '@ng-mf/components';

echarts.use([GaugeChart, CanvasRenderer]);

type SalesGaugeOption = EChartsOption & {
  series?: GaugeSeriesOption[];
};

@Component({
  selector: 'app-sales-overview-widget',
  imports: [
    MatIcon,
  ],
  templateUrl: './sales-overview-widget.html',
  styleUrl: './sales-overview-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class SalesOverviewWidget {
  private localeID = inject(LOCALE_ID);
  private colorSchemeStore = inject(ColorSchemeStore);

  salesGrowth = input(70.8);
  numberOfSales = input(2343);
  totalRevenue = input(30900);
  numberOfSalesPercentageChange = input(4.5);
  totalRevenuePercentageChange = input(6.8);

  readonly isDarkMode = signal(this.colorSchemeStore.theme() === 'dark');
  formattedTotalRevenue = computed(() => {
    const revenue = this.totalRevenue();
    return revenue >= 1000 ? `$${(revenue / 1000).toFixed(1)}k` : `$${revenue}`;
  });

  formattedNumberOfSales = computed(() => {
    return new Intl.NumberFormat(this.localeID).format(this.numberOfSales());
  });

  private chartContainer = viewChild.required<ElementRef<HTMLDivElement>>('salesChart');
  private chartInstance: ECharts | undefined;

  private chartOption = computed<SalesGaugeOption>(() => {
    const growthPercentage = this.salesGrowth() / 100;
    const isDark = this.isDarkMode();

    const progressColor = isDark ? '#FFA726' : '#FFB74D';
    const baseColor = isDark ? '#424242' : '#F5F5F5';
    const detailColor = isDark ? '#FAFAFA' : '#212121';
    const titleColor = isDark ? '#9E9E9E' : '#667085';

    return {
      series: [
        {
          type: 'gauge',
          radius: '150%',
          center: ['50%', '85%'],
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 100,
          itemStyle: {
            borderRadius: 10
          },
          splitNumber: 12,
          progress: {
            show: true,
            width: 30,
            itemStyle: {
              color: progressColor,
              borderRadius: 10
            },
          },
          pointer: { show: false },
          axisLine: {
            lineStyle: {
              width: 30,
              color: [
                [growthPercentage, progressColor],
                [1, baseColor],
              ],
            },
          },
          axisTick: { show: false },
          splitLine: {
            distance: -35,
            length: 14,
            lineStyle: {
              width: 3,
              color: isDark ? '#212121' : '#FFFFFF',
            },
          },
          axisLabel: { show: false },
          detail: {
            valueAnimation: true,
            formatter: '{value}%',
            offsetCenter: [0, '-40%'],
            fontSize: 42,
            fontWeight: 'bolder',
            color: detailColor,
          },
          title: {
            offsetCenter: [0, '-15%'],
            fontSize: 16,
            color: titleColor,
            fontWeight: 'normal',
          },
          data: [
            {
              value: this.salesGrowth(),
              name: 'Sales Growth',
            },
          ],
        },
      ],
    };
  });


  constructor() {
    effect(() => {
      this.isDarkMode.set(this.colorSchemeStore.theme() === 'dark');
    });

    effect((onCleanup) => {
      const element = this.chartContainer().nativeElement;
      const options = this.chartOption();

      let chartInstance = getInstanceByDom(element) ?? init(element);
      chartInstance.setOption(options, { notMerge: true });

      const resizeObserver = new ResizeObserver(() => {
        chartInstance?.resize();
      });

      resizeObserver.observe(element);

      onCleanup(() => {
        resizeObserver.disconnect();
        chartInstance?.dispose();
      });
    });
  }
}
