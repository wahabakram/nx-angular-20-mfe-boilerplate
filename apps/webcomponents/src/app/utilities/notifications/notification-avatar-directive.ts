import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcNotificationAvatar]',
  exportAs: 'mfcNotificationAvatar',
  host: {
    'class': 'mfc-notification-avatar'
  }
})
export class NotificationAvatarDirective {
}
