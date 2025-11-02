import { Component, effect, ElementRef, inject, input, OnDestroy } from '@angular/core';

@Component({
  selector: 'mfc-panel-footer',
  exportAs: 'mfcPanelFooter',
  templateUrl: './panel-footer.html',
  styleUrl: './panel-footer.scss',
  host: {
    'class': 'mfc-panel-footer'
  }
})
export class PanelFooter implements OnDestroy {
  private _elementRef = inject(ElementRef);

  height = input<number>();

  ngOnDestroy() {
    this._elementRef.nativeElement.style.removeProperty('--mfc-panel-footer-height');
  }

  constructor() {
    effect(() => {
      if (this.height()) {
        this._elementRef.nativeElement.style.setProperty('--mfc-panel-footer-height', this.height() + 'px');
      } else {
        this._elementRef.nativeElement.style.removeProperty('--mfc-panel-footer-height');
      }
    });
  }
}
