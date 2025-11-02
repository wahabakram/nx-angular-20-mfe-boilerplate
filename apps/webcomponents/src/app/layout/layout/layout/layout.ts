import { booleanAttribute, Component, input } from '@angular/core';
import { LAYOUT } from '../types';

let nextId = 0;

@Component({
  selector: 'mfc-layout',
  exportAs: 'mfcLayout',
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  providers: [
    {
      provide: LAYOUT,
      useExisting: LayoutComponent
    }
  ],
  host: {
    'class': 'mfc-layout',
    '[class.is-window-mode]': 'windowMode()'
  }
})
export class LayoutComponent {
  layoutId = input<string>(`layout-${nextId++}`);
  windowMode = input(false, {
    transform: booleanAttribute
  });
}
