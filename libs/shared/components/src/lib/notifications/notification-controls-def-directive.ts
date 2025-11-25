import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfNotificationControlsDef]',
})
export class NotificationControlsDefDirective {
  readonly templateRef = inject(TemplateRef);
}
