import { Component, ElementRef, inject, input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'mf-color-picker-thumbnail,[mf-color-picker-thumbnail]',
  exportAs: 'mfColorPickerThumbnail',
  templateUrl: './color-picker-thumbnail.html',
  styleUrl: './color-picker-thumbnail.scss',
  host: {
    'class': 'mf-color-picker-thumbnail'
  }
})
export class ColorPickerThumbnail {
  private _elementRef = inject(ElementRef);

  color = input('');

  ngOnChanges(changes: SimpleChanges) {
    if (!this.color()) {
      return;
    }

    this._elementRef.nativeElement.style.setProperty('--mf-color-picker-thumbnail-bg', this.color());
  }
}
