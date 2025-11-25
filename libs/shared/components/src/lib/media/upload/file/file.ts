import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';
import { UploadFileState } from '../types';

@Component({
  selector: 'mf-file',
  exportAs: 'mfFile',
  templateUrl: './file.html',
  styleUrl: './file.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'mf-file',
    '[class.has-error]': "state() === 'error'"
  }
})
export class File {
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
