import { Component, input } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

export interface EngagementWidgetData {
  id: any;
  title: string;
  value: number;
  from: number;
  percentageChange: number;
}

@Component({
  selector: 'app-engagement-widget',
  imports: [
    DecimalPipe,
    MatIcon,
    NgClass
  ],
  templateUrl: './engagement-widget.html',
  styleUrl: './engagement-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class EngagementWidget {
  id = input();
  widget = input.required<EngagementWidgetData>();
}
