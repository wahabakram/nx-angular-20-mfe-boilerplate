import { Component, input } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

export interface SalesConversionWidgetData {
  id: any;
  title: string;
  value: number;
  from: number;
  percentageChange: number;
}

@Component({
  selector: 'app-sales-conversion-widget',
  imports: [
    DecimalPipe,
    MatIcon,
    NgClass
  ],
  templateUrl: './sales-conversion-widget.html',
  styleUrl: './sales-conversion-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class SalesConversionWidget {
  id = input();
  widget = input.required<SalesConversionWidgetData>();
}
