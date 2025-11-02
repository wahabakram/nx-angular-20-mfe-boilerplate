import { Component } from '@angular/core';

@Component({
  selector: 'mfc-skeleton-block',
  exportAs: 'mfcSkeletonBlock',
  template: '',
  styleUrl: './skeleton-block.scss',
  host: {
    'class': 'mfc-skeleton-item mfc-skeleton-block'
  }
})
export class SkeletonBlock {
}
