import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

@Component({
  selector: 'app-analytics-new-signups-widget',
  imports: [],
  templateUrl: './analytics-new-signups-widget.html',
  styleUrl: './analytics-new-signups-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class AnalyticsNewSignupsWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }
}
