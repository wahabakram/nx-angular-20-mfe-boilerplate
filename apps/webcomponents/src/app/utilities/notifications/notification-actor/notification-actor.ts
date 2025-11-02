import { Component, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'mfc-notification-actor,[mfc-notification-actor]',
  imports: [],
  templateUrl: './notification-actor.html',
  styleUrl: './notification-actor.scss',
  host: {
    'class': 'mfc-notification-actor',
    '[class.as-link]': 'asLink'
  }
})
export class NotificationActor {
  private elementRef = inject(ElementRef);

  protected get asLink() {
    return (this.elementRef.nativeElement as HTMLElement).tagName === 'A';
  }
}
