import { Component } from '@angular/core';

@Component({
  selector: 'mf-tab-panel-header',
  exportAs: 'mfTabPanelHeader',
  templateUrl: './tab-panel-header.html',
  styleUrl: './tab-panel-header.scss',
  host: {
    'class': 'mf-tab-panel-header'
  }
})
export class TabPanelHeader {
}
