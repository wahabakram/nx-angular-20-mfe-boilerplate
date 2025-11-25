import { Directive } from '@angular/core';

@Directive({
  selector: '[mfIncidentsToggleIcon]',
  exportAs: 'mfIncidentsToggleIcon',
  host: {
    'class': 'mf-incidents-toggle-icon',
  }
})
export class IncidentsToggleIconDirective {

}
