import { Component, input } from '@angular/core';

@Component({
  selector: 'mf-skeleton',
  exportAs: 'mfSkeleton',
  templateUrl: './skeleton.html',
  styleUrl: './skeleton.scss',
  host: {
    'class': 'mf-skeleton',
    '[class.is-direction-row]': 'direction() === "row"',
    '[class.is-direction-col]': 'direction() === "col"',
  }
})
export class Skeleton {
  direction = input<'row' | 'col'>('row');
}
