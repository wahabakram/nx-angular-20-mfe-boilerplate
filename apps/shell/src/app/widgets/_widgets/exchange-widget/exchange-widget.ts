import { Component, DestroyRef, inject, input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatRipple } from '@angular/material/core';
import { MatButton } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DASHBOARD, Dashboard } from '@ng-mf/components';

@Component({
  selector: 'app-exchange-widget',
  imports: [
    MatIcon,
    MatDivider,
    MatRipple,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './exchange-widget.html',
  styleUrl: './exchange-widget.scss',
  host: {
    class: 'widget-container'
  }
})
export class ExchangeWidget implements OnInit {
  private _fb = inject(FormBuilder);
  private _destroyRef = inject(DestroyRef);
  private _dashboard = inject<Dashboard>(DASHBOARD, { optional: true });

  widget = input();

  conversionFromRate = 1.3275;
  conversionToRate = 0.7532;
  currentConversionRate = 1.3275;
  currencyFrom = 'GPB';
  currencyTo = 'USD';

  form: FormGroup = this._fb.group({
    from: [],
    to: []
  });

  ngOnInit() {
    this.form.get('from')
      ?.valueChanges
      .pipe(
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((value: number) => {
        if (value !== null) {
          const result = (value * this.currentConversionRate).toFixed(4);
          this.form.get('to')?.setValue(result, {
            emitEvent: false
          });
        }
      })
    ;
    this.form.get('to')
      ?.valueChanges
      .pipe(
        takeUntilDestroyed(this._destroyRef)
      )
      .subscribe((value: number) => {
        if (value !== null) {
          const result = (value / this.currentConversionRate).toFixed(4);
          this.form.get('from')?.setValue(result, {
            emitEvent: false
          });
        }
      })
    ;
  }

  toggleCurrencies() {
    const prevCurrencyFrom = this.currencyFrom;
    this.currencyFrom = this.currencyTo;
    this.currencyTo = prevCurrencyFrom;

    const prevConversionToRate = this.conversionToRate;
    this.conversionToRate = this.conversionFromRate;
    this.conversionFromRate = prevConversionToRate;
    this.currentConversionRate = this.conversionFromRate;

    this.form.get('from')?.setValue(this.form.value['from']);
  }
}
