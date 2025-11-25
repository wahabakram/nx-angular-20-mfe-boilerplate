import { booleanAttribute, Component, inject, input } from '@angular/core';
import { Incidents } from '../incidents/incidents';
import { INCIDENTS } from '../properties';

@Component({
  selector: 'mf-incidents-list',
  exportAs: 'mf-incidents-list',
  templateUrl: './incidents-list.html',
  styleUrl: './incidents-list.scss',
  host: {
    'class': 'mf-incidents-list',
    '[class.is-fixed]': 'fixed()',
    '(click)': '_handleClick($event)'
  }
})
export class IncidentsList {
  private _parent = inject<Incidents>(INCIDENTS, { optional: true });

  fixed = input(false, {
    transform: booleanAttribute
  });

  _handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.closest('.mf-incident') === null) {
      this._parent?.toggleVisibility();
    }
  }
}
