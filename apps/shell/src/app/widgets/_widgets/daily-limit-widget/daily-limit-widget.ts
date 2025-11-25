import { Component, computed, input } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-daily-limit-widget',
  imports: [
    CurrencyPipe,
    DecimalPipe
  ],
  templateUrl: './daily-limit-widget.html',
  styleUrl: './daily-limit-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class DailyLimitWidget {
  id = input();
  widget = input();

  spentAmount = input(2500);
  totalLimit = input(20000);

  percentage = computed(() => {
    const total = this.totalLimit();
    const spent = this.spentAmount();

    if (total === 0) {
      return 0;
    }
    return (spent / total) * 100;
  });
}
