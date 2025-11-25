import { Component, effect, ElementRef, inject, input, OnDestroy } from '@angular/core';

@Component({
  selector: 'mf-panel-footer',
  exportAs: 'mfPanelFooter',
  templateUrl: './panel-footer.html',
  styleUrl: './panel-footer.scss',
  host: {
    'class': 'mf-panel-footer'
  }
})
export class PanelFooter implements OnDestroy {
  private _elementRef = inject(ElementRef);

  height = input<number>();

  ngOnDestroy() {
    this._elementRef.nativeElement.style.removeProperty('--mf-panel-footer-height');
  }

  constructor() {
    effect(() => {
      if (this.height()) {
        this._elementRef.nativeElement.style.setProperty('--mf-panel-footer-height', this.height() + 'px');
      } else {
        this._elementRef.nativeElement.style.removeProperty('--mf-panel-footer-height');
      }
    });
  }
}
