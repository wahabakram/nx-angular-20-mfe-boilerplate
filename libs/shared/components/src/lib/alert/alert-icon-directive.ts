import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfAlertIcon]',
  exportAs: 'mfAlertIcon',
  host: {
    'class': 'mf-alert-icon'
  }
})
export class AlertIconDirective {
  public readonly templateRef = inject(TemplateRef, { optional: true });
}
