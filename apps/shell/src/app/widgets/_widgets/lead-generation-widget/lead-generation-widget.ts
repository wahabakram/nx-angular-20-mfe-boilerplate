import { Component, input } from '@angular/core';
import { DecimalPipe, NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

export interface LeadGenerationWidgetData {
  id: any;
  title: string;
  value: number;
  from: number;
  percentageChange: number;
}

@Component({
  selector: 'app-lead-generation-widget',
  imports: [DecimalPipe, NgClass, MatIcon],
  templateUrl: './lead-generation-widget.html',
  styleUrl: './lead-generation-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class LeadGenerationWidget {
  id = input();
  widget = input.required<LeadGenerationWidgetData>();
}
