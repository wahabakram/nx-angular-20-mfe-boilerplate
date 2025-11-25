import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { SequentialBackgroundDirective } from '@ng-mf/components';
import { MatIconButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';

export interface IBasicMetricWidget {
  id: any;
  data: BasicMetricWidgetData;
}

export interface BasicMetricWidgetData {
  name: string;
  value: number;
  percentageChange: number;
  viewUrl?: string;
}

@Component({
  selector: 'app-basic-metric-widget',
  imports: [
    DecimalPipe,
    MatIcon,
    MatIconButton,
    RouterLink
  ],
  hostDirectives: [
    SequentialBackgroundDirective
  ],
  templateUrl: './basic-metric-widget.html',
  styleUrl: './basic-metric-widget.scss',
  host: {
    class: 'widget-container'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicMetricWidget {
  readonly widget = input.required<IBasicMetricWidget>();

  readonly isPositive = computed(() => this.widget().data.percentageChange >= 0);
  readonly trendText = computed(() => {
    const sign = this.isPositive() ? '+' : '';
    const formattedPercent = this.widget().data.percentageChange.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${sign}${formattedPercent}%`;
  });
}
