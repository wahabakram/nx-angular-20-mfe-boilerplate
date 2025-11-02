import { Component, input, Input } from '@angular/core';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'mfc-command-bar-command,[mfc-command-bar-command]',
  exportAs: 'mfcCommandBarCommand',
  templateUrl: './command-bar-command.html',
  styleUrl: './command-bar-command.scss',
  hostDirectives: [
    MatRipple,
  ],
  host: {
    'class': 'mfc-command-bar-command'
  }
})
export class CommandBarCommand {
  shortcut = input('');
}
