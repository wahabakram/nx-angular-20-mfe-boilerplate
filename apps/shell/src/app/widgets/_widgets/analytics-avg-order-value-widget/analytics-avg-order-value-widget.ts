import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@ng-mf/components';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-analytics-avg-order-value-widget',
  imports: [
    MatIcon
  ],
  templateUrl: './analytics-avg-order-value-widget.html',
  styleUrl: './analytics-avg-order-value-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class AnalyticsAvgOrderValueWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }
}
