import { Component, input } from '@angular/core';

@Component({
  selector: 'mfc-skeleton',
  exportAs: 'mfcSkeleton',
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.scss',
  host: {
    'class': 'mfc-skeleton',
    '[class.is-direction-row]': 'direction() === "row"',
    '[class.is-direction-col]': 'direction() === "col"',
  }
})
export class Skeleton {
  direction = input<'row' | 'col'>('row');
}
