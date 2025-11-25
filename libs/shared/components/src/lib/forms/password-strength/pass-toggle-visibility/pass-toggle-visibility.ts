import { booleanAttribute, Component, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'mf-pass-toggle-visibility',
  exportAs: 'mfPassToggleVisibility',
  imports: [
    MatIconButton,
    MatRipple,
    MatIcon
  ],
  templateUrl: './pass-toggle-visibility.html',
  styleUrl: './pass-toggle-visibility.scss',
  host: {
    'class': 'mf-pass-toggle-visibility',
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
