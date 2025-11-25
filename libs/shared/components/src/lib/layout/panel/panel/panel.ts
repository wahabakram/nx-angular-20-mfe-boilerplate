import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'mf-panel',
  exportAs: 'mfPanel',
  templateUrl: './panel.html',
  styleUrl: './panel.scss',
  host: {
    'class': 'mf-panel',
    '[class.is-absolute]': 'absolute()'
  }
})
export class Panel {
  absolute = input(false, {
    transform: booleanAttribute
  });
}
