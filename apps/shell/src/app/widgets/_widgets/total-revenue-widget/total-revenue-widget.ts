import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Dashboard, DASHBOARD } from '@ng-mf/components';

@Component({
  selector: 'app-total-revenue-widget',
  imports: [
    MatIcon,
  ],
  templateUrl: './total-revenue-widget.html',
  styleUrl: './total-revenue-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class TotalRevenueWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input();

  ngOnInit() {
  }
}
