import { Component, inject, input, OnInit } from '@angular/core';
import {
  MchartLine,
  MchartTooltipBody,
  MchartTooltip,
  MchartTooltipTitle,
} from '@ng-mf/components';
import { Dashboard, DASHBOARD } from '@ng-mf/components';

@Component({
  selector: 'app-total-projects-widget',
  imports: [MchartLine, MchartTooltip, MchartTooltipTitle, MchartTooltipBody],
  templateUrl: './total-projects-widget.html',
  styleUrl: './total-projects-widget.scss',
  host: {
    class: 'widget-container',
  },
})
export class TotalProjectsWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  data = [47, 54, 38, 24, 65, 37];
  labels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

  widget = input();

  ngOnInit() {}
}
