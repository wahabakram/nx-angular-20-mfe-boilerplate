import { Component, inject, input, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DASHBOARD } from '@ng-mf/components';

@Component({
  selector: 'app-current-plan-widget',
  imports: [MatButton, RouterLink],
  templateUrl: './current-plan-widget.html',
  styleUrl: './current-plan-widget.scss',
  host: {
    class: 'widget-container',
  },
})
export class CurrentPlanWidget implements OnInit {
  private _dashboard = inject<any>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {}
}
