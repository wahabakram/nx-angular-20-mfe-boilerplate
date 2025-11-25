import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@ng-mf/components';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-analytics-total-orders-widget',
  imports: [
    MatIcon
  ],
  templateUrl: './analytics-total-orders-widget.html',
  styleUrl: './analytics-total-orders-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class AnalyticsTotalOrdersWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }
}
