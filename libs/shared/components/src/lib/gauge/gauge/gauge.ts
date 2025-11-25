import {
  Component, input,
  numberAttribute,
  OnInit
} from '@angular/core';

@Component({
  selector: 'mf-gauge',
  exportAs: 'mfGauge',
  templateUrl: './gauge.html',
  styleUrl: './gauge.scss',
  host: {
    'class': 'mf-gauge'
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

  protected strokeDasharray = '';
  protected initialOffset = 0;
  protected strokeDashoffset = 0;

  ngOnInit() {
    const circumfcerence = 2 * Math.PI * this.radius();
    const valueInCircumfcerence = (this.value() / 100) * circumfcerence;
    this.strokeDasharray = `${circumfcerence} ${circumfcerence}`;
    this.initialOffset = circumfcerence;
    this.strokeDashoffset = this.initialOffset - valueInCircumfcerence;
  }
}
