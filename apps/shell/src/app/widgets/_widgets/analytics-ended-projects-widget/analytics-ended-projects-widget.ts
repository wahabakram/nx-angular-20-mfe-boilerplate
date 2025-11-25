import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@ng-mf/components';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-analytics-ended-projects-widget',
  imports: [
    MatIcon,
    MatIconButton
  ],
  templateUrl: './analytics-ended-projects-widget.html',
  styleUrl: './analytics-ended-projects-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class AnalyticsEndedProjectsWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }
}
