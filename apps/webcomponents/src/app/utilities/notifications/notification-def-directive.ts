import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfcNotificationDef]',
})
export class NotificationDefDirective {
  readonly templateRef = inject(TemplateRef);
  mfcNotificationDef = input.required<string>();
}
