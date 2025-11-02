import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcTabPanelItemIcon]',
  exportAs: 'mfcTabPanelItemIcon',
  host: {
    'class': 'mfc-tab-panel-item-icon'
  }
})
export class TabPanelItemIconDirective {
}
