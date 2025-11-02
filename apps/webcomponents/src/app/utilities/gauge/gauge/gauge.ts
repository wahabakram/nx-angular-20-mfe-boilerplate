import {
  Component, input,
  numberAttribute,
  OnInit
} from '@angular/core';

@Component({
  selector: 'mfc-gauge',
  exportAs: 'mfcGauge',
  templateUrl: './gauge.html',
  styleUrl: './gauge.scss',
  host: {
    'class': 'mfc-gauge'
  }
})
export class Gauge implements OnInit {
  value = input(0, {
    transform: numberAttribute
  });
  strokeWidth = input(10, {
    transform: numberAttribute
  });
  radius = input(50, {
    transform: numberAttribute
  });

  protected strokeDasharray: string = '';
  protected initialOffset: number = 0;
  protected strokeDashoffset: number = 0;

  ngOnInit() {
    const circumfcerence = 2 * Math.PI * this.radius();
    const valueInCircumfcerence = (this.value() / 100) * circumfcerence;
    this.strokeDasharray = `${circumfcerence} ${circumfcerence}`;
    this.initialOffset = circumfcerence;
    this.strokeDashoffset = this.initialOffset - valueInCircumfcerence;
  }
}
