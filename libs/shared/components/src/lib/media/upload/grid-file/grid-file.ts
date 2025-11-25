import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { UploadFileState } from '../types';
import { Gauge, GaugeValue } from '../../../gauge';

@Component({
  selector: 'mf-grid-file',
  exportAs: 'mfGridFile',
  imports: [
    GaugeValue,
    Gauge
  ],
  templateUrl: './grid-file.html',
  styleUrl: './grid-file.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'mf-grid-file',
    '[class.has-error]': "state() === 'error'"
  }
})
export class GridFile {
  name = input.required();
  size = input();
  progress = input(0, {
    transform: numberAttribute
  });
  progressingMessage = input();
  errorMessage = input();
  remainingTime = input();
  state = input<UploadFileState>('uploading');
}
