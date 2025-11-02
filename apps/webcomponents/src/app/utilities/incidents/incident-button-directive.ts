import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcIncidentButton]',
  exportAs: 'mfcIncidentButton',
  host: {
    'class': 'mfc-incident-button',
  }
})
export class IncidentButtonDirective {

}
