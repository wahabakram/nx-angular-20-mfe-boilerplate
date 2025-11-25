import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

export interface IExploreWidget {
  title: string;
  description: string;
  iconName: string;
}

@Component({
  selector: 'app-explore-widget',
  exportAs: 'ExploreWidget',
  imports: [MatIcon, MatRipple],
  templateUrl: './explore-widget.html',
  styleUrl: './explore-widget.scss',
  host: {
    class: 'widget-container',
  },
})
export class ExploreWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input.required<IExploreWidget>();

  ngOnInit() {}
}
