import { Component, inject, input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

export interface IQuickActionWidget {
  title: string;
  description: string;
  iconName: string;
  route: string;
}

@Component({
  selector: 'app-quick-action-widget',
  imports: [MatIcon, MatRipple],
  templateUrl: './quick-action-widget.html',
  styleUrl: './quick-action-widget.scss',
  host: {
    class: 'widget-container',
  },
})
export class QuickActionWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });
  private router = inject(Router);

  widget = input.required<IQuickActionWidget>();

  ngOnInit() {}

  navigate() {
    this.router.navigate([this.widget().route]);
  }
}
