import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcAlertIcon]',
  exportAs: 'mfcAlertIcon',
  host: {
    'class': 'mfc-alert-icon'
  }
})
export class AlertIconDirective {
  public readonly templateRef = inject(TemplateRef, { optional: true });
}
