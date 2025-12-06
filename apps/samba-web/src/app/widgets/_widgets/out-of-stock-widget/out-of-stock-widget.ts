import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Dashboard, DASHBOARD, WidgetItem } from '@ng-mf/components';

@Component({
  selector: 'app-out-of-stock-widget',
  imports: [
    MatIcon,
    MatRipple,
    MatTooltip
  ],
  templateUrl: './out-of-stock-widget.html',
  styleUrl: './out-of-stock-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class OutOfStockWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<WidgetItem>();

  // Mock data - replace with real service data
  outOfStockCount = signal(2);

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }
}
