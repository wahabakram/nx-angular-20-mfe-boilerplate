import { booleanAttribute, Directive, input } from '@angular/core';

@Directive({
  selector: '[mfNotificationProps]',
  exportAs: 'mfNotificationProps',
  host: {
    'class': 'mf-notification-props',
    '[class.is-unread]': 'isUnread()',
  }
})
export class NotificationPropsDirective {
  isUnread = input(false, {
    transform: booleanAttribute
  });
}
