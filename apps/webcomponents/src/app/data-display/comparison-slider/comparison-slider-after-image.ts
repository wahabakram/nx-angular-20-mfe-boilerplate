import { Directive } from '@angular/core';

@Directive({
  selector: '[mfcComparisonSliderAfterImage]',
  host: {
    '(dragstart)': 'onDragStart($event)'
  }
})
export class ComparisonSliderAfterImageDirective {
  protected onDragStart(event: DragEvent) {
    event.preventDefault();
  }
}
