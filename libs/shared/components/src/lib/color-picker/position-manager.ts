import { ConnectedPosition } from '@angular/cdk/overlay';
import { ColorPickerPosition } from './properties';

export class PositionManager {
  private _positions: { [prop: string]: ConnectedPosition } = {
    'below-start': {
      originY: 'bottom',
      overlayY: 'top',
      originX: 'start',
      overlayX: 'start',
      panelClass: ['mf-color-picker-below', 'mf-color-picker-below-start']
    },
    'below-center': {
      originY: 'bottom',
      overlayY: 'top',
      originX: 'center',
      overlayX: 'center',
      panelClass: ['mf-color-picker-below', 'mf-color-picker-below-center']
    },
    'below-end': {
      originY: 'bottom',
      overlayY: 'top',
      originX: 'end',
      overlayX: 'end',
      panelClass: ['mf-color-picker-below', 'mf-color-picker-below-end']
    },
    'above-start': {
      originY: 'top',
      overlayY: 'bottom',
      originX: 'start',
      overlayX: 'start',
      panelClass: ['mf-color-picker-above', 'mf-color-picker-above-start']
    },
    'above-center': {
      originY: 'top',
      overlayY: 'bottom',
      originX: 'center',
      overlayX: 'center',
      panelClass: ['mf-color-picker-above', 'mf-color-picker-above-center']
    },
    'above-end': {
      originY: 'top',
      overlayY: 'bottom',
      originX: 'end',
      overlayX: 'end',
      panelClass: ['mf-color-picker-above', 'mf-color-picker-above-end']
    },
    'before-start': {
      originY: 'top',
      overlayY: 'top',
      originX: 'start',
      overlayX: 'end',
      panelClass: ['mf-color-picker-before', 'mf-color-picker-before-start']
    },
    'before-center': {
      originY: 'center',
      overlayY: 'center',
      originX: 'start',
      overlayX: 'end',
      panelClass: ['mf-color-picker-before', 'mf-color-picker-before-center']
    },
    'before-end': {
      originY: 'bottom',
      overlayY: 'bottom',
      originX: 'start',
      overlayX: 'end',
      panelClass: ['mf-color-picker-before', 'mf-color-picker-before-end']
    },
    'after-end': {
      originY: 'bottom',
      overlayY: 'bottom',
      originX: 'end',
      overlayX: 'start',
      panelClass: ['mf-color-picker-after', 'mf-color-picker-after-end']
    },
    'after-center': {
      originY: 'center',
      overlayY: 'center',
      originX: 'end',
      overlayX: 'start',
      panelClass: ['mf-color-picker-after', 'mf-color-picker-after-center']
    },
    'after-start': {
      originY: 'top',
      overlayY: 'top',
      originX: 'end',
      overlayX: 'start',
      panelClass: ['mf-color-picker-after', 'mf-color-picker-after-start']
    }
  };

  private _positionPairs: any = {
    'below-start': 'above-start',
    'below-center': 'above-center',
    'below-end': 'above-end',
    'above-start': 'below-start',
    'above-center': 'below-center',
    'above-end': 'below-end',
    'before-end': 'before-start',
    'before-center': 'after-center',
    'before-start': 'before-end',
    'after-end': 'after-start',
    'after-center': 'before-center',
    'after-start': 'after-end'
  };

  build(position: ColorPickerPosition): ConnectedPosition[] {
    return [this._positions[position], this._positions[this._positionPairs[position]]];
  }
}
