import {
  booleanAttribute,
  Component, effect,
  ElementRef,
  inject,
  input,
  output,
  Renderer2
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { AnnouncementVariant } from '../types';

@Component({
  selector: 'mf-announcement',
  exportAs: 'mfAnnouncement',
  imports: [
    MatIcon,
    MatIconButton
  ],
  templateUrl: './announcement.html',
  styleUrl: './announcement.scss',
  host: {
    'class': 'mf-announcement'
  }
})
export class Announcement {
  private _elementRef = inject(ElementRef);
  private _renderer = inject(Renderer2);

  variant = input<AnnouncementVariant>('neutral');
  iconName = input('');
  closable = input(false, {
    transform: booleanAttribute
  });

  readonly closed = output<void>();

  constructor() {
    effect(() => {
      this._renderer.setAttribute(this._elementRef.nativeElement, 'data-variant', this.variant() || 'neutral');
    });
  }

  protected close() {
    this.closed.emit();
  }
}
