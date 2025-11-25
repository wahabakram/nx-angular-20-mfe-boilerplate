import { Component, ElementRef, inject } from '@angular/core';

@Component({
  selector: 'mf-notification-actor,[mf-notification-actor]',
  imports: [],
  templateUrl: './notification-actor.html',
  styleUrl: './notification-actor.scss',
  host: {
    'class': 'mf-notification-actor',
    '[class.as-link]': 'asLink'
  }
})
export class NotificationActor {
  private elementRef = inject(ElementRef);

  protected get asLink() {
    return (this.elementRef.nativeElement as HTMLElement).tagName === 'A';
  }
}
