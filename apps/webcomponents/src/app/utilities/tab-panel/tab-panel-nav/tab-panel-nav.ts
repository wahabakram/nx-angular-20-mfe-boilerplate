import { Component } from '@angular/core';
import { TAB_PANEL_NAV } from '../types';

@Component({
  selector: 'mfc-tab-panel-nav',
  exportAs: 'mfcTabPanelNav',
  templateUrl: './tab-panel-nav.html',
  styleUrl: './tab-panel-nav.scss',
  providers: [
    {
      provide: TAB_PANEL_NAV,
      useExisting: TabPanelNav,
    },
  ],
  host: {
    class: 'mfc-tab-panel-nav',
  },
})
export class TabPanelNav {
  nextId = 0;
}
