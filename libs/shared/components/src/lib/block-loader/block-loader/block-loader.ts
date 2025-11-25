import { booleanAttribute, ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'mf-block-loader',
  exportAs: 'mfBlockLoader',
  imports: [
    MatProgressSpinner
  ],
  templateUrl: './block-loader.html',
  styleUrl: './block-loader.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'mf-block-loader',
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
