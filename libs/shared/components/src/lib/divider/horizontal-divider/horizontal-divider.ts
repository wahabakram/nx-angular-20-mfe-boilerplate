import { Component } from '@angular/core';

@Component({
  selector: 'mf-horizontal-divider,mf-h-divider',
  exportAs: 'mfHorizontalDivider',
  templateUrl: './horizontal-divider.html',
  styleUrl: './horizontal-divider.scss',
  host: {
    class: 'mf-horizontal-divider',
  },
})
export class HorizontalDivider {}
