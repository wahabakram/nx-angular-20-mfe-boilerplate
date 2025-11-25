import { Directive } from '@angular/core';

@Directive({
  selector: '[mfIncidentClose]',
  exportAs: 'mfIncidentClose',
  host: {
    'class': 'mf-incident-close'
  }
})
export class IncidentCloseDirective {

}
