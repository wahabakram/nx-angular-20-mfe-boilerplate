import { Component } from '@angular/core';
import { TAB_PANEL_ASIDE } from '../types';

@Component({
  selector: 'mf-tab-panel-aside',
  exportAs: 'mfTabPanelAside',
  templateUrl: './tab-panel-aside.html',
  styleUrl: './tab-panel-aside.scss',
  providers: [
    {
      provide: TAB_PANEL_ASIDE,
      useExisting: TabPanelAside
    }
  ],
  host: {
    'class': 'mf-tab-panel-aside'
  }
})
export class TabPanelAside {
  nextId = 0;
}
