import { Component, ElementRef, inject, input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'mfc-color-picker-thumbnail,[mfc-color-picker-thumbnail]',
  exportAs: 'mfcColorPickerThumbnail',
  templateUrl: './color-picker-thumbnail.html',
  styleUrl: './color-picker-thumbnail.scss',
  host: {
    'class': 'mfc-color-picker-thumbnail'
  }
})
export class ColorPickerThumbnail {
  private _elementRef = inject(ElementRef);

  color = input('');

  ngOnChanges(changes: SimpleChanges) {
    if (!this.color()) {
      return;
    }

    this._elementRef.nativeElement.style.setProperty('--mfc-color-picker-thumbnail-bg', this.color());
  }
}
