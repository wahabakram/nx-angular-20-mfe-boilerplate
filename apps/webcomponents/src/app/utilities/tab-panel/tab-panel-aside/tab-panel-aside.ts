import { Component } from '@angular/core';
import { TAB_PANEL_ASIDE } from '../types';

@Component({
  selector: 'mfc-tab-panel-aside',
  exportAs: 'mfcTabPanelAside',
  templateUrl: './tab-panel-aside.html',
  styleUrl: './tab-panel-aside.scss',
  providers: [
    {
      provide: TAB_PANEL_ASIDE,
      useExisting: TabPanelAside
    }
  ],
  host: {
    'class': 'mfc-tab-panel-aside'
  }
})
export class TabPanelAside {
  nextId = 0;
}
