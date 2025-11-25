import { Component, effect, ElementRef, inject, input, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'mf-panel-header',
  exportAs: 'mfPanelHeader',
  templateUrl: './panel-header.html',
  styleUrl: './panel-header.scss',
  host: {
    'class': 'mf-panel-header'
  }
})
export class PanelHeader implements OnDestroy {
  private _elementRef = inject(ElementRef);

  height = input<number>();

  ngOnDestroy() {
    this._elementRef.nativeElement.style.removeProperty('--mf-panel-header-height');
  }

  constructor() {
    effect(() => {
      if (this.height()) {
        this._elementRef.nativeElement.style.setProperty('--mf-panel-header-height', this.height() + 'px');
      } else {
        this._elementRef.nativeElement.style.removeProperty('--mf-panel-header-height');
      }
    });
  }
}
