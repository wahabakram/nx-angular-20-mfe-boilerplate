import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

@Component({
  selector: 'app-today-sales-widget',
  imports: [
    MatIcon,
    MatButton
  ],
  templateUrl: './today-sales-widget.html',
  styleUrl: './today-sales-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class TodaySalesWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  readonly id = input();
  readonly widget = input();

  ngOnInit() {
  }
}
