import { Component, inject, input, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatRipple } from '@angular/material/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Dashboard, DASHBOARD, WidgetItem } from '@ng-mf/components';

@Component({
  selector: 'app-total-inventory-value-widget',
  imports: [
    MatIcon,
    MatRipple,
    MatTooltip
  ],
  templateUrl: './total-inventory-value-widget.html',
  styleUrl: './total-inventory-value-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class TotalInventoryValueWidget implements OnInit {
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input<WidgetItem>();

  // Mock data - replace with real service data
  totalValue = signal(4850000);

  ngOnInit() {
    if (this._dashboard && this.widget()) {
      this._dashboard.markWidgetAsLoaded(this.widget()?.['id']);
    }
  }
}
