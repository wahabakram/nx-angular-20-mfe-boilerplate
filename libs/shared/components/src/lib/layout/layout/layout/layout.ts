import { booleanAttribute, Component, input } from '@angular/core';
import { LAYOUT } from '../types';

let nextId = 0;

@Component({
  selector: 'mf-layout',
  exportAs: 'mfLayout',
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  providers: [
    {
      provide: LAYOUT,
      useExisting: Layout
    }
  ],
  host: {
    'class': 'mf-layout',
    '[class.is-window-mode]': 'windowMode()'
  }
})
export class Layout {
  layoutId = input<string>(`layout-${nextId++}`);
  windowMode = input(false, {
    transform: booleanAttribute
  });
}
