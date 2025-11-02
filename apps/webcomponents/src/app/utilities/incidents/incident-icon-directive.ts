import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcIncidentIcon]',
  exportAs: 'mfcIncidentIcon',
  host: {
    'class': 'mfc-incident-icon'
  }
})
export class IncidentIconDirective {

}
