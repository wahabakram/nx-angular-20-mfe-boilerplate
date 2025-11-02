import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'mfc-panel',
  exportAs: 'mfcPanel',
  templateUrl: './panel.html',
  styleUrl: './panel.scss',
  host: {
    'class': 'mfc-panel',
    '[class.is-absolute]': 'absolute()'
  }
})
export class Panel {
  absolute = input(false, {
    transform: booleanAttribute
  });
}
