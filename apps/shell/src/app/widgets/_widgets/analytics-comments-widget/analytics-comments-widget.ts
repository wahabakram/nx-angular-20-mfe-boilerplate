import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@ng-mf/components';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-analytics-comments-widget',
  imports: [
    MatIcon
  ],
  templateUrl: './analytics-comments-widget.html',
  styleUrl: './analytics-comments-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class AnalyticsCommentsWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }
}
