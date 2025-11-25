import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentConfig } from '../form-config.model';

@Component({
  selector: 'mf-toggle-field',
  exportAs: 'mfToggleField',
  imports: [
    MatSlideToggle,
    ReactiveFormsModule
  ],
  templateUrl: './toggle-field.html',
  styleUrl: './toggle-field.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleField {
  control = input.required<FormControl>();
  config = input.required<ComponentConfig>();
}
