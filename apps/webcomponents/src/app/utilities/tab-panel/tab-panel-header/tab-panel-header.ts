import { Component } from '@angular/core';

@Component({
  selector: 'mfc-tab-panel-header',
  exportAs: 'mfcTabPanelHeader',
  templateUrl: './tab-panel-header.html',
  styleUrl: './tab-panel-header.scss',
  host: {
    'class': 'mfc-tab-panel-header'
  }
})
export class TabPanelHeader {
}
