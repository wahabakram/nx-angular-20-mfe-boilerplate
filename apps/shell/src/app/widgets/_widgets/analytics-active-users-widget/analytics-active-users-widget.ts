import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

@Component({
  selector: 'app-analytics-active-users-widget',
  imports: [],
  templateUrl: './analytics-active-users-widget.html',
  styleUrl: './analytics-active-users-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class AnalyticsActiveUsersWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }
}
