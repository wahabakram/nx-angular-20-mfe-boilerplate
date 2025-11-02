import { Component } from '@angular/core';

@Component({
  selector: 'mfc-gauge-value',
  exportAs: 'mfcGaugeValue',
  templateUrl: './gauge-value.html',
  styleUrl: './gauge-value.scss',
  host: {
    'class': 'mfc-gauge-value'
  }
})
export class GaugeValue {
}
