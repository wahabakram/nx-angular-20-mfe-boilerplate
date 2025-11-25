import { Directive } from '@angular/core';

@Directive({
  selector: '[mfAlertAction]',
  exportAs: 'mfAlertAction',
  host: {
    'class': 'mf-alert-action'
  }
})
export class AlertActionDirective {
}
