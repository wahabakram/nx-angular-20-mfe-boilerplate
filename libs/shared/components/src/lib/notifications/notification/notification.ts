import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'mf-notification,[mf-notification]',
  exportAs: 'mfNotification',
  imports: [],
  templateUrl: './notification.html',
  styleUrl: './notification.scss',
  host: {
    'class': 'mf-notification',
    '[class.is-unread]': 'isUnread()'
  }
})
export class Notification {
  isUnread = input(false, {
    transform: booleanAttribute
  });
}
