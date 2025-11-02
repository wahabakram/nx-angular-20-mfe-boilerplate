import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentConfig } from '../form-config.model';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';

@Component({
  selector: 'mfc-textarea-field',
  exportAs: 'mfcTextareaField',
  imports: [
    MatError,
    MatHint,
    MatLabel,
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    CdkTextareaAutosize
  ],
  templateUrl: './textarea-field.html',
  styleUrl: './textarea-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaField {
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
