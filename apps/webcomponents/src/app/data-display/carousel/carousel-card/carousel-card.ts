import { Component, ElementRef, inject } from '@angular/core';
import { CAROUSEL_CARD } from '../types';

@Component({
  selector: 'mfc-carousel-card,[mfc-carousel-card]',
  exportAs: 'mfcCarouselCard',
  imports: [],
  providers: [
    {
      provide: CAROUSEL_CARD,
      useExisting: CarouselCard
    }
  ],
  templateUrl: './carousel-card.html',
  styleUrl: './carousel-card.scss',
  host: {
    'class': 'mfc-carousel-card',
  }
})
export class CarouselCard {
  private _elementRef = inject(ElementRef);

  get element(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
