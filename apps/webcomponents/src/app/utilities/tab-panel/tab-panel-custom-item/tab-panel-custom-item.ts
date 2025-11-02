import { Component, inject, input } from '@angular/core';
import { TabPanelApiService } from '../tab-panel-api';

@Component({
  selector: 'mfc-tab-panel-custom-item',
  exportAs: 'mfcTabPanelCustomItem',
  templateUrl: './tab-panel-custom-item.html',
  styleUrl: './tab-panel-custom-item.scss',
  host: {
    'class': 'mfc-tab-panel-custom-item',
    '(click)': '_handleClick()'
  }
})
export class TabPanelCustomItem {
  readonly api = inject(TabPanelApiService);

  for = input<any>();

  protected _handleClick() {
    if (!this.for()) {
      return;
    }

    this.api.activate(this.for());
  }
}
