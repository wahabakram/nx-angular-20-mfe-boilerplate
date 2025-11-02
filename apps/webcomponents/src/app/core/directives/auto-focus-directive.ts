import { AfterViewInit, Directive, ElementRef, inject } from '@angular/core';

@Directive({
  selector: '[mfcAutoFocus]',
  exportAs: 'mfcAutoFocus',
})
export class AutoFocusDirective implements AfterViewInit {
  private _elementRef = inject(ElementRef);

  ngAfterViewInit(): void {
    this._elementRef.nativeElement.focus();
  }
}
