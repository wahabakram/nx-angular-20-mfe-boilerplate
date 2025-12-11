import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Icon } from '@ng-mf/components';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Dashboard, DASHBOARD, WidgetItem } from '@ng-mf/components';

@Component({
  selector: 'app-total-profit-widget',
  imports: [
    Icon,
    MatRipple,
    MatTooltip
  ],
  templateUrl: './total-profit-widget.html',
  styleUrl: './total-profit-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class TotalProfitWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<WidgetItem>();

  // Mock data - replace with real service data
  totalProfit = signal(485000);

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }
}
