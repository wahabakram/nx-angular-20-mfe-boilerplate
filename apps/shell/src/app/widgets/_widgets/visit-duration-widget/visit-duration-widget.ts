import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Dashboard, DASHBOARD } from '@ng-mf/components';

@Component({
  selector: 'app-visit-duration-widget',
  imports: [MatIcon],
  templateUrl: './visit-duration-widget.html',
  styleUrl: './visit-duration-widget.scss',
  host: {
    class: 'widget-container',
  },
})
export class VisitDurationWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {}
}
