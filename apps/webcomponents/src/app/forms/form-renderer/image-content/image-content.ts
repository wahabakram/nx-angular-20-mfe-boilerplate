import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ComponentConfig } from '../form-config.model';

@Component({
  selector: 'mfc-image-content',
  exportAs: 'mfcImageContent',
  imports: [],
  templateUrl: './image-content.html',
  styleUrl: './image-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'mfc-image-content',
  }
})
export class ImageContent {
  config = input.required<ComponentConfig>();
}
