import { Directive } from '@angular/core';

@Directive({
  selector: '[mfNotificationAvatar]',
  exportAs: 'mfNotificationAvatar',
  host: {
    'class': 'mf-notification-avatar'
  }
})
export class NotificationAvatarDirective {
}
