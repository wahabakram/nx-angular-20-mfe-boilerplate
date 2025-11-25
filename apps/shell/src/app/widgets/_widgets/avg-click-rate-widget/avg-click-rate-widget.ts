import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

@Component({
  selector: 'app-avg-click-rate-widget',
  imports: [MatIcon, MatRipple, MatTooltip],
  templateUrl: './avg-click-rate-widget.html',
  styleUrl: './avg-click-rate-widget.scss',
  host: {
    class: 'widget-container',
  },
})
export class AvgClickRateWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {}
}
