import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentConfig } from '../form-config.model';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'mf-checkbox-field',
  imports: [
    MatCheckbox,
    ReactiveFormsModule
  ],
  templateUrl: './checkbox-field.html',
  styleUrl: './checkbox-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxField {
  control = input.required<FormControl>();
  config = input.required<ComponentConfig>();
}
