import {
  Component,
  ElementRef,
  inject,
  input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ContentFadePosition } from './types';

@Component({
  selector: 'mfc-content-fade',
  exportAs: 'mfcContentFade',
  templateUrl: './content-fade.html',
  styleUrl: './content-fade.scss',
  host: {
    'class': 'mfc-content-fade',
    '[class.position-both]': 'position() === "both"',
    '[class.position-start]': 'position() === "start"',
    '[class.position-end]': 'position() === "end"',
  }
})
export class ContentFade implements OnChanges {
  private _elementRef = inject(ElementRef);

  color = input();
  width = input();
  position = input<ContentFadePosition>('both');

  ngOnChanges(changes: SimpleChanges) {
    if (changes['width']) {
      (this._elementRef.nativeElement as HTMLElement).style.setProperty('--mfc-content-fade-width', changes['width'].currentValue, 'important');
    }

    if (changes['color']) {
      (this._elementRef.nativeElement as HTMLElement).style.setProperty('--mfc-content-fade-color', changes['color'].currentValue, 'important');
    }
  }
}
