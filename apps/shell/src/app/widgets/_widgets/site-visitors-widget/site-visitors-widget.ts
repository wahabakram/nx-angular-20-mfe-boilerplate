import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

@Component({
  selector: '-site-visitors-widget',
  imports: [
    MatIcon
  ],
  templateUrl: './site-visitors-widget.html',
  styleUrl: './site-visitors-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class SiteVisitorsWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {
  }
}
