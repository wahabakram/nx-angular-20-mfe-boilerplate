import { Component, inject, input, OnInit } from '@angular/core';
import {
  MchartLine,
  MchartTooltipBody,
  MchartTooltip,
  MchartTooltipTitle
} from '@ng-mf/components';
import { Dashboard, DASHBOARD } from '@ng-mf/components';

@Component({
  selector: 'app-total-tasks-widget',
  templateUrl: './total-tasks-widget.html',
  imports: [
    MchartTooltipBody,
    MchartTooltip,
    MchartTooltipTitle,
    MchartLine
  ],
  styleUrl: './total-tasks-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class TotalTasksWidget implements OnInit {
  data = [47, 54, 38, 24, 65, 37];
  labels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {
  }
}
