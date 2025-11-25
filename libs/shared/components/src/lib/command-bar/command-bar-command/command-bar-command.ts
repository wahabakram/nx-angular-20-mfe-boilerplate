import { Component, input, Input } from '@angular/core';
import { MatRipple } from '@angular/material/core';

@Component({
  selector: 'mf-command-bar-command,[mf-command-bar-command]',
  exportAs: 'mfCommandBarCommand',
  templateUrl: './command-bar-command.html',
  styleUrl: './command-bar-command.scss',
  hostDirectives: [
    MatRipple,
  ],
  host: {
    'class': 'mf-command-bar-command'
  }
})
export class CommandBarCommand {
  shortcut = input('');
}
