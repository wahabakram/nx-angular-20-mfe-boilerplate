import { Component } from '@angular/core';

@Component({
  selector: 'mf-skeleton-block',
  exportAs: 'mfSkeletonBlock',
  template: '',
  styleUrl: './skeleton-block.scss',
  host: {
    'class': 'mf-skeleton-item mf-skeleton-block'
  }
})
export class SkeletonBlock {
}
