import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[mfFocusMonitor]'
})
export class FocusMonitorDirective {
  private _elementRef = inject(ElementRef);
}
