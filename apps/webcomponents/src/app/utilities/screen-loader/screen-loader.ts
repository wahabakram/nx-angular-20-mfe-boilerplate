import { booleanAttribute, Component, input } from '@angular/core';
import { MatProgressBar } from '@angular/material/progress-bar';

@Component({
  selector: 'mfc-screen-loader',
  exportAs: 'mfcScreenLoader',
  imports: [
    MatProgressBar
  ],
  templateUrl: './screen-loader.html',
  styleUrl: './screen-loader.scss',
  host: {
    'class': 'mfc-screen-loader',
    '[class.is-opened]': 'opened()'
  }
})
export class ScreenLoader {
  opened = input(false, {
    transform: booleanAttribute
  });
}
