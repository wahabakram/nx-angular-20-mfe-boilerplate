import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@ng-mf/components';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-analytics-running-projects-widget',
  imports: [
    MatIcon,
    MatIconButton
  ],
  templateUrl: './analytics-running-projects-widget.html',
  styleUrl: './analytics-running-projects-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class AnalyticsRunningProjectsWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }
}
