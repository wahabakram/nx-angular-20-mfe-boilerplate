import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcIncidentsToggleIcon]',
  exportAs: 'mfcIncidentsToggleIcon',
  host: {
    'class': 'mfc-incidents-toggle-icon',
  }
})
export class IncidentsToggleIconDirective {

}
