import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'mfc-action-required',
  exportAs: 'mfcActionRequired',
  imports: [
    MatButton,
    MatIcon
  ],
  templateUrl: './action-required.html',
  styleUrl: './action-required.scss',
  host: {
    'class': 'mfc-action-required',
  }
})
export class ActionRequired {
  actionText = input();
  iconName = input();
  description = input.required();
  buttonText = input.required();

  readonly buttonClicked = output<void>();
}
