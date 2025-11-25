import { Directive } from '@angular/core';

@Directive({
  selector: '[mfComparisonSliderBeforeImage]',
  host: {
    '(dragstart)': 'onDragStart($event)'
  }
})
export class ComparisonSliderBeforeImageDirective {
  protected onDragStart(event: DragEvent) {
    event.preventDefault();
  }
}
