import { Component, ElementRef, inject } from '@angular/core';
import { CAROUSEL_CARD } from '../types';

@Component({
  selector: 'mf-carousel-card,[mf-carousel-card]',
  exportAs: 'mfCarouselCard',
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
    'class': 'mf-carousel-card',
  }
})
export class CarouselCard {
  private _elementRef = inject(ElementRef);

  get element(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
