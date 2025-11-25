import { Component, computed, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

export type StatCardIcon = 'shopping_cart' | 'group' | 'inventory_2' | 'attach_money' | string;

export interface StatCard {
  title: string;
  icon: StatCardIcon;
  currentValue: number;
  lastMonthValue: number;
  percentageChange?: number;
  valuePrefix?: string;
}

@Component({
  selector: 'app-common-stats',
  imports: [
    DecimalPipe,
    MatIcon
  ],
  templateUrl: './common-stats.widget.html',
  styleUrl: './common-stats.widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class CommonStatsWidget {
  public data = input.required<StatCard>();

  public isPositive = computed(() => (this.data().percentageChange ?? 0) >= 0);

  public valueFormat = computed(() =>
    this.data().icon === 'attach_money' ? '1.2-2' : '1.0-0'
  );

  public changeIndicatorClasses = computed(() =>
    this.isPositive()
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700'
  );
}
