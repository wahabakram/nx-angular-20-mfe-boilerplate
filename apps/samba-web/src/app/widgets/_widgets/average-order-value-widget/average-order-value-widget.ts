import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Icon } from '@ng-mf/components';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Dashboard, DASHBOARD, WidgetItem } from '@ng-mf/components';

@Component({
  selector: 'app-average-order-value-widget',
  imports: [
    Icon,
    MatRipple,
    MatTooltip
  ],
  templateUrl: './average-order-value-widget.html',
  styleUrl: './average-order-value-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class AverageOrderValueWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<WidgetItem>();

  // Mock data - replace with real service data
  averageOrderValue = signal(18254.49);

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }
}
