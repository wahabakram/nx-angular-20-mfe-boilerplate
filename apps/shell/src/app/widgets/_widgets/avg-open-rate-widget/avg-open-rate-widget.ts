import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

@Component({
  selector: 'app-avg-open-rate-widget',
  imports: [
    MatIcon,
    MatRipple,
    MatTooltip
  ],
  templateUrl: './avg-open-rate-widget.html',
  styleUrl: './avg-open-rate-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class AvgOpenRateWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {
  }
}
