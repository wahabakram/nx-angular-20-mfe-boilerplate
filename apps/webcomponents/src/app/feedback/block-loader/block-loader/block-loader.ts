import { booleanAttribute, ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'mfc-block-loader',
  exportAs: 'mfcBlockLoader',
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './block-loader.html',
  styleUrl: './block-loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'mfc-block-loader',
    '[class.is-loading]': 'loading()'
  }
})
export class BlockLoader {
  readonly loading = input(false, {
    transform: booleanAttribute
  });
  readonly spinnerDiameter = input(48, {
    transform: numberAttribute
  });
  readonly spinnerStrokeWidth = input(4, {
    transform: numberAttribute
  });
}
