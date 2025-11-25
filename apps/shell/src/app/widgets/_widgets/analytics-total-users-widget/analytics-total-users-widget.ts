import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

@Component({
  selector: 'app-analytics-total-users-widget',
  imports: [],
  templateUrl: './analytics-total-users-widget.html',
  styleUrl: './analytics-total-users-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class AnalyticsTotalUsersWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }
}
