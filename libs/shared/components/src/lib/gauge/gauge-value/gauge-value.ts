import { Component } from '@angular/core';

@Component({
  selector: 'mf-gauge-value',
  exportAs: 'mfGaugeValue',
  templateUrl: './gauge-value.html',
  styleUrl: './gauge-value.scss',
  host: {
    'class': 'mf-gauge-value'
  }
})
export class GaugeValue {
}
