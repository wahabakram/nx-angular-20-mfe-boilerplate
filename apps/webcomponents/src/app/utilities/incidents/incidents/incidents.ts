import {
  Component
} from '@angular/core';
import { INCIDENTS } from '../properties';

@Component({
  selector: 'mfc-incidents',
  exportAs: 'mfcIncidents',
  templateUrl: './incidents.html',
  styleUrl: './incidents.scss',
  providers: [
    {
      provide: INCIDENTS,
      useExisting: Incidents
    }
  ],
  host: {
    'class': 'mfc-incidents',
    '[class.is-visible]': 'isVisible',
  }
})
export class Incidents {
  isVisible = false;

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}
