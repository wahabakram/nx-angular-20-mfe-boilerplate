import { Component, inject, input } from '@angular/core';
import { IncidentsStore } from '../incidents.store';
import { MatIconButton } from '@angular/material/button';

let incidentId = 0;

@Component({
  selector: 'mfc-incident,[mfc-incident]',
  exportAs: 'mfcIncident',
  imports: [
    MatIconButton
  ],
  templateUrl: './incident.html',
  styleUrl: './incident.scss',
  host: {
    'class': 'mfc-incident'
  }
})
export class Incident {
  private _incidentsStore = inject(IncidentsStore);

  incidentId = input(`incident-${incidentId++}`);

  close() {
    this._incidentsStore.hide();
  }
}
