import { Directive } from '@angular/core';

@Directive({
  selector: '[mfTabPanelItemIcon]',
  exportAs: 'mfTabPanelItemIcon',
  host: {
    'class': 'mf-tab-panel-item-icon'
  }
})
export class TabPanelItemIconDirective {
}
