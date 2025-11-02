import { booleanAttribute, Directive, input } from '@angular/core';

@Directive({
  selector: '[mfcNotificationProps]',
  exportAs: 'mfcNotificationProps',
  host: {
    'class': 'mfc-notification-props',
    '[class.is-unread]': 'isUnread()',
  }
})
export class NotificationPropsDirective {
  isUnread = input(false, {
    transform: booleanAttribute
  });
}
