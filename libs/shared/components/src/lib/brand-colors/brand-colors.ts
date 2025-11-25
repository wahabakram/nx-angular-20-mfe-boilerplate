import {
  Component,
  OnChanges,
  SimpleChanges,
  input,
  output,
  forwardRef,
  inject,
  ChangeDetectorRef, booleanAttribute
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

const defaultColors = [
  '#35d1b3', '#08b0fe', '#8268f2', '#ae52d3', '#eb4ea3',
  '#fb811e', '#fac624', '#c2c2c2', '#4ed7ff'
];

@Component({
  selector: 'mf-brand-colors',
  exportAs: 'mfBrandColors',
  imports: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BrandColors),
      multi: true
    }
  ],
  templateUrl: './brand-colors.html',
  styleUrl: './brand-colors.scss',
  host: {
    'class': 'mf-brand-colors',
    '[class.is-disabled]': 'disabled() || _disabled',
    '[class.with-gradient]': 'withGradient()'
  }
})
export class BrandColors implements ControlValueAccessor, OnChanges {
  private _cdr = inject(ChangeDetectorRef);
  protected _disabled = false;
  protected _selectedColor: string;

  colors = input<string[]>(defaultColors);
  selectedColor = input<string>();
  withGradient = input(false, {
    transform: booleanAttribute
  });
  disabled = input(false, {
    transform: booleanAttribute
  });

  readonly colorChange = output<string>();

  _onChange: any = () => {};
  _onTouched: any = () => {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedColor']) {
      this._selectedColor = changes['selectedColor'].currentValue;
    }
  }

  selectColor(color: string): void {
    this._selectedColor = color;
    this.colorChange.emit(color);
    this._onChange(color);
    this._onTouched(color);
  }

  writeValue(_selectedColor: any) {
    this._selectedColor = _selectedColor;
    this._cdr.detectChanges();
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: BooleanInput): void {
    this._disabled = coerceBooleanProperty(isDisabled);
  }
}
