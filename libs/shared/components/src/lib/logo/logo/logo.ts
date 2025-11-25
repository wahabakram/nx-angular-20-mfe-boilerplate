import { Component, input } from '@angular/core';
import { LogoAppearance } from '../types';

@Component({
  selector: 'mf-logo,[mf-logo]',
  exportAs: 'mfLogo',
  imports: [],
  templateUrl: './logo.html',
  styleUrl: './logo.scss',
  host: {
    'class': 'mf-logo',
    '[class.is-text]': 'appearance() === "text"',
    '[class.is-image]': 'appearance() === "image"',
  }
})
export class Logo {
  appearance = input<LogoAppearance>('text');
}
