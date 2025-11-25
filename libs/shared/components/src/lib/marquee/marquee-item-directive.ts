import { Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[mfMarqueeItem]',
})
export class MarqueeItemDirective {
  private _elementRef = inject(ElementRef);

  get nativeElement(): HTMLElement {
    return this._elementRef.nativeElement;
  }
}
