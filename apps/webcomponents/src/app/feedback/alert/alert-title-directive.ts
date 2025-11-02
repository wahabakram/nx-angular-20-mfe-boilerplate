import { Directive } from '@angular/core';

@Directive({
  selector: 'mfc-alert-title,[mfcAlertTitle]',
  exportAs: 'mfcAlertTitle',
  host: {
    'class': 'mfc-alert-title'
  }
})
export class AlertTitleDirective {
}
