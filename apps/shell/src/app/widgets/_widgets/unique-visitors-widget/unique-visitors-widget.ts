import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

@Component({
  selector: 'app-unique-visitors-widget',
  imports: [MatIcon, MatRipple, MatTooltip],
  templateUrl: './unique-visitors-widget.html',
  styleUrl: './unique-visitors-widget.scss',
  host: {
    class: 'widget-container',
  },
})
export class UniqueVisitorsWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {}
}
