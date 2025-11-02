import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentConfig } from '../form-config.model';
import { TimezoneSelect } from '../../timezone-select';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'mfc-timezone-field',
  exportAs: 'mfcTimezoneField',
  imports: [
    MatError,
    MatFormField,
    MatLabel,
    TimezoneSelect,
    ReactiveFormsModule,
    MatHint
  ],
  templateUrl: './timezone-field.html',
  styleUrl: './timezone-field.scss'
})
export class TimezoneField {
  control = input.required<FormControl>();
  config = input.required<ComponentConfig>();

  getErrorMessage(): string {
    const errors = this.control().errors;
    if (!errors) return '';
    const errorKey = Object.keys(errors)[0];
    const validator = this.config().validators?.find((v: any) => v.type === errorKey);
    return validator?.message || 'Invalid value';
  }
}
