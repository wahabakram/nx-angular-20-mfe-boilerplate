import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { UploadFileState } from '../types';
import { Gauge, GaugeValue } from '../../../utilities/gauge';

@Component({
  selector: 'mfc-grid-file',
  exportAs: 'mfcGridFile',
  imports: [
    GaugeValue,
    Gauge
  ],
  templateUrl: './grid-file.html',
  styleUrl: './grid-file.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'mfc-grid-file',
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
