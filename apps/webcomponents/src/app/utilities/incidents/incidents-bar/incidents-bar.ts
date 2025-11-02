import { Component, inject } from '@angular/core';
import { INCIDENTS } from '../properties';
import { Incidents } from '../incidents/incidents';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'mfc-incidents-bar',
  exportAs: 'mfcIncidentsBar',
  imports: [
    MatIconButton
  ],
  templateUrl: './incidents-bar.html',
  styleUrl: './incidents-bar.scss',
  host: {
    'class': 'mfc-incidents-bar',
    '(click)': '_handleClick($event)'
  }
})
export class IncidentsBar {
  private _parent = inject<Incidents>(INCIDENTS, { optional: true });

  _handleClick(_event?: Event) {
    this._parent?.toggleVisibility();
  }
}
