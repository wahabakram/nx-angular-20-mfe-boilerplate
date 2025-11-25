import { Directive } from '@angular/core';

@Directive({
  selector: '[mfIncidentButton]',
  exportAs: 'mfIncidentButton',
  host: {
    'class': 'mf-incident-button',
  }
})
export class IncidentButtonDirective {

}
