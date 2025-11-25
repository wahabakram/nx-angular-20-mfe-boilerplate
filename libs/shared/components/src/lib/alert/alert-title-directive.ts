import { Directive } from '@angular/core';

@Directive({
  selector: 'mf-alert-title,[mfAlertTitle]',
  exportAs: 'mfAlertTitle',
  host: {
    'class': 'mf-alert-title'
  }
})
export class AlertTitleDirective {
}
