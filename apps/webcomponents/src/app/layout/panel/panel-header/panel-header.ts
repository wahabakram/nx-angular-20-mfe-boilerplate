import { Component, effect, ElementRef, inject, input, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'mfc-panel-header',
  exportAs: 'mfcPanelHeader',
  templateUrl: './panel-header.html',
  styleUrl: './panel-header.scss',
  host: {
    'class': 'mfc-panel-header'
  }
})
export class PanelHeader implements OnDestroy {
  private _elementRef = inject(ElementRef);

  height = input<number>();

  ngOnDestroy() {
    this._elementRef.nativeElement.style.removeProperty('--mfc-panel-header-height');
  }

  constructor() {
    effect(() => {
      if (this.height()) {
        this._elementRef.nativeElement.style.setProperty('--mfc-panel-header-height', this.height() + 'px');
      } else {
        this._elementRef.nativeElement.style.removeProperty('--mfc-panel-header-height');
      }
    });
  }
}
