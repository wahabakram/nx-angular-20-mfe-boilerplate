import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

@Component({
  selector: 'app-analytics-conversion-rate-widget',
  imports: [],
  templateUrl: './analytics-conversion-rate-widget.html',
  styleUrl: './analytics-conversion-rate-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class AnalyticsConversionRateWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }
}
