import { Component } from '@angular/core';

@Component({
  selector: 'mf-command-bar-divider',
  exportAs: 'mfCommandBarDivider',
  templateUrl: './command-bar-divider.html',
  styleUrl: './command-bar-divider.scss',
  host: {
    'class': 'mf-command-bar-divider'
  }
})
export class CommandBarDivider {
}
