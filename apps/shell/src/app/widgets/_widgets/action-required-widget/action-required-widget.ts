import { Component, inject, input, OnInit } from '@angular/core';
import { ActionRequired } from '@ng-mf/components';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

export interface IActionRequiredWidget {
  iconName?: string;
  description: string;
  buttonText: string;
  actionText: string;
}

@Component({
  selector: 'app-action-required-widget',
  exportAs: 'ActionRequiredWidget',
  imports: [ActionRequired],
  templateUrl: './action-required-widget.html',
  styleUrl: './action-required-widget.scss',
  host: {
    class: 'app-action-required-widget',
  },
})
export class ActionRequiredWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<IActionRequiredWidget>();

  ngOnInit() {}
}
