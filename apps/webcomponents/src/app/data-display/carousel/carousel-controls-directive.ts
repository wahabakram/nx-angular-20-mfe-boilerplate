import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcCarouselControls]',
  
  host: {
    'class': 'mfc-carousel-controls',
  }
})
export class CarouselControlsDirective {

}
