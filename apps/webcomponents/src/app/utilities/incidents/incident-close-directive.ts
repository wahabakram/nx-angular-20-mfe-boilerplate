import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcIncidentClose]',
  exportAs: 'mfcIncidentClose',
  host: {
    'class': 'mfc-incident-close'
  }
})
export class IncidentCloseDirective {

}
