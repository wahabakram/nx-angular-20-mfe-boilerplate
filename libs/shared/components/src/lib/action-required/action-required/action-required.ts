import { Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'mf-action-required',
  exportAs: 'mfActionRequired',
  imports: [
    MatButton,
    MatIcon
  ],
  templateUrl: './action-required.html',
  styleUrl: './action-required.scss',
  host: {
    'class': 'mf-action-required',
  }
})
export class ActionRequired {
  actionText = input();
  iconName = input();
  description = input.required();
  buttonText = input.required();

  readonly buttonClicked = output<void>();
}
