import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ComponentConfig } from '../form-config.model';

@Component({
  selector: 'mf-image-content',
  exportAs: 'mfImageContent',
  imports: [],
  templateUrl: './image-content.html',
  styleUrl: './image-content.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'mf-image-content',
  }
})
export class ImageContent {
  config = input.required<ComponentConfig>();
}
