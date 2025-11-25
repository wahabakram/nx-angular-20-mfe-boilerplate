import { Directive } from '@angular/core';

@Directive({
  selector: '[mfIncidentIcon]',
  exportAs: 'mfIncidentIcon',
  host: {
    'class': 'mf-incident-icon'
  }
})
export class IncidentIconDirective {

}
