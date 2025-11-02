import { Component, input } from '@angular/core';
import { LogoAppearance } from '../types';

@Component({
  selector: 'mfc-logo,[mfc-logo]',
  exportAs: 'mfcLogo',
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
  host: {
    'class': 'mfc-logo',
    '[class.is-text]': 'appearance() === "text"',
    '[class.is-image]': 'appearance() === "image"',
  }
})
export class Logo {
  appearance = input<LogoAppearance>('text');
}
