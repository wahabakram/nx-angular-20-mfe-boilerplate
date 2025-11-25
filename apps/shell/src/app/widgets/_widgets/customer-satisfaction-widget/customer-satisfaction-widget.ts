import { Component, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Dashboard, DASHBOARD } from '@ng-mf/components';

@Component({
  selector: 'app-customer-satisfaction-widget',
  imports: [
    MatIcon
  ],
  templateUrl: './customer-satisfaction-widget.html',
  styleUrl: './customer-satisfaction-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class CustomerSatisfactionWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  readonly id = input();
  readonly widget = input();

  ngOnInit() {
  }
}
