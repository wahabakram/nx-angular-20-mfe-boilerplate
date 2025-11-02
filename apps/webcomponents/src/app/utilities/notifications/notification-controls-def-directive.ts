import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcNotificationControlsDef]',
})
export class NotificationControlsDefDirective {
  readonly templateRef = inject(TemplateRef);
}
