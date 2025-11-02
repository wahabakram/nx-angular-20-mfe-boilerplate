import { booleanAttribute, Component, inject, input } from '@angular/core';
import { MF_SEGMENTED } from '../types';
import { Segmented } from '../segmented/segmented';

@Component({
  selector: 'mfc-segmented-button,[mfc-segmented-button]',
  exportAs: 'mfcSegmentedButton',
  templateUrl: './segmented-button.html',
  styleUrl: './segmented-button.scss',
  host: {
    class: 'mfc-segmented-button',
    '[class.icon-only]': 'iconOnly()',
    '[class.is-selected]': '_isSelected',
    '[class.is-disabled]': 'disabled() || null',
    '(click)': '_handleClick()',
  },
})
export class SegmentedButton {
  private _segmented = inject<Segmented>(MF_SEGMENTED, { skipSelf: true });

  value = input.required<any>();
  disabled = input(false, {
    transform: booleanAttribute,
  });
  iconOnly = input(false, {
    transform: booleanAttribute,
  });

  get _isSelected(): boolean {
    return this._segmented.api.isSelected(this.value());
  }

  get api() {
    return {
      isSelected: () => this._isSelected,
    };
  }

  protected _handleClick() {
    this._segmented.api.select(this.value());
  }
}
