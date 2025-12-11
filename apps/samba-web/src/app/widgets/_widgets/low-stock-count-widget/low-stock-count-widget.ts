import { Component, inject, input, OnInit, signal } from '@angular/core';
import { Icon } from '@ng-mf/components';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Dashboard, DASHBOARD, WidgetItem } from '@ng-mf/components';

@Component({
  selector: 'app-low-stock-count-widget',
  imports: [
    Icon,
    MatRipple,
    MatTooltip
  ],
  templateUrl: './low-stock-count-widget.html',
  styleUrl: './low-stock-count-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class LowStockCountWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<WidgetItem>();

  // Mock data - replace with real service data
  lowStockCount = signal(8);

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }
}
