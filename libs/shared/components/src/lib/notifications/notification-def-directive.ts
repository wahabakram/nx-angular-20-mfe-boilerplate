import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[mfNotificationDef]',
})
export class NotificationDefDirective {
  readonly templateRef = inject(TemplateRef);
  mfNotificationDef = input.required<string>();
}
