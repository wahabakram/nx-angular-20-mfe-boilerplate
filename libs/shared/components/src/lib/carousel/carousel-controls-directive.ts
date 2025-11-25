import { Directive } from '@angular/core';

@Directive({
  selector: '[mfCarouselControls]',
  
  host: {
    'class': 'mf-carousel-controls',
  }
})
export class CarouselControlsDirective {

}
