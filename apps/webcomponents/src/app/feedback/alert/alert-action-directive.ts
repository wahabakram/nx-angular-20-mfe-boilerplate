import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcAlertAction]',
  exportAs: 'mfcAlertAction',
  host: {
    'class': 'mfc-alert-action'
  }
})
export class AlertActionDirective {
}
