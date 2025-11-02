import { booleanAttribute, Component, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'mfc-pass-toggle-visibility',
  exportAs: 'mfcPassToggleVisibility',
  imports: [
    MatIconButton,
    MatRipple,
    MatIcon
  ],
  templateUrl: './pass-toggle-visibility.html',
  styleUrl: './pass-toggle-visibility.scss',
  host: {
    'class': 'mfc-pass-toggle-visibility',
  }
})
export class PassToggleVisibility {
  visible = input(false, {
    transform: booleanAttribute
  });
  tabindex = input('');

  protected _visible = this.visible();

  get type() {
    return this._visible ? 'text' : 'password';
  }
}
