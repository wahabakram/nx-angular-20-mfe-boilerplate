import { Component, inject, input } from '@angular/core';
import { IncidentsStore } from '../incidents.store';
import { MatIconButton } from '@angular/material/button';

let incidentId = 0;

@Component({
  selector: 'mf-incident,[mf-incident]',
  exportAs: 'mfIncident',
  imports: [
    MatIconButton
  ],
  templateUrl: './incident.html',
  styleUrl: './incident.scss',
  host: {
    'class': 'mf-incident'
  }
})
export class Incident {
  private _incidentsStore = inject(IncidentsStore);

  incidentId = input(`incident-${incidentId++}`);

  close() {
    this._incidentsStore.hide();
  }
}
