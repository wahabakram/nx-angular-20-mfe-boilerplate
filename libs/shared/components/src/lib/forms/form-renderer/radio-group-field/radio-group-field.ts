import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentConfig } from '../form-config.model';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { MatError, MatHint } from '@angular/material/form-field';

@Component({
  selector: 'mf-radio-group-field',
  exportAs: 'mfRadioGroupField',
  imports: [
    MatRadioButton,
    MatRadioGroup,
    ReactiveFormsModule,
    MatError,
    MatHint,
  ],
  templateUrl: './radio-group-field.html',
  styleUrl: './radio-group-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioGroupField {
  control = input.required<FormControl>();
  config = input.required<ComponentConfig>();

  getErrorMessage(): string {
    const errors = this.control().errors;
    if (!errors) {
      return '';
    }
    const errorKey = Object.keys(errors)[0];
    const validator = this.config().validators?.find((v: any) => v.type === errorKey);
    return validator?.message || 'Invalid value';
  }

  get options() {
    return this.config().payload?.['options'] || [];
  }
}
