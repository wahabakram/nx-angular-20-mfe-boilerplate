import { Component, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export interface InfoCard {
  type: 'progress' | 'info';
  title: string;
  icon: string;
  bgColor: string;
  borderColor?: string;
  value?: string;
  description: string;
  limit?: number;
  currentValue?: number;
}

@Component({
  selector: 'app-finance-information-widget',
  imports: [
    MatIcon
  ],
  templateUrl: './finance-information-widget.html',
  styleUrl: './finance-information-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class FinanceInformationWidget {
  readonly cards = signal<InfoCard[]>([
    {
      type: 'progress',
      title: 'Monthly Limits',
      value: '$4,890',
      description: 'Of $5.000',
      limit: 5000,
      currentValue: 3890,
      icon: 'credit_card',
      bgColor: 'bg-indigo-50',
    },
    {
      type: 'info',
      title: 'Cashback in June',
      value: '$12,42',
      description: 'Cashback in June',
      icon: 'receipt_long',
      bgColor: 'bg-orange-50',
    },
    {
      type: 'info',
      title: 'New Deal',
      description: 'Available in June 2022',
      icon: 'apartment',
      bgColor: 'bg-green-50',
    },
    {
      type: 'info',
      title: 'Swap',
      description: 'Swap & Request Money',
      icon: 'swap_horiz',
      bgColor: 'bg-pink-50',
    }
  ]);

  // A pure function for derived data. A computed() signal would be ideal if inputs were also signals.
  getProgressPercentage(current?: number, limit?: number): number {
    if (current === undefined || limit === undefined || limit === 0) {
      return 0;
    }
    return (current / limit) * 100;
  }
}
