import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'mfc-notification,[mfc-notification]',
  exportAs: 'mfcNotification',
  imports: [],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
  host: {
    'class': 'mfc-notification',
    '[class.is-unread]': 'isUnread()'
  }
})
export class Notification {
  isUnread = input(false, {
    transform: booleanAttribute
  });
}
