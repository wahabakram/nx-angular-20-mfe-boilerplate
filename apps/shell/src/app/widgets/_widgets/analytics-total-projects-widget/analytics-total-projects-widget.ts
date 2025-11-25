import { Component, inject, input, OnInit } from '@angular/core';
import { DASHBOARD, Dashboard } from '@ng-mf/components';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-analytics-total-projects-widget',
  imports: [
    MatIconButton,
    MatIcon
  ],
  templateUrl: './analytics-total-projects-widget.html',
  styleUrl: './analytics-total-projects-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class AnalyticsTotalProjectsWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<any>();

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }
}
