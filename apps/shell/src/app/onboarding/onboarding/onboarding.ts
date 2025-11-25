import { Component, inject, signal } from '@angular/core';
import { Logo } from '@ng-mf/components';
import { MatButton } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Stepper, Step } from '@ng-mf/components';
import { MatHint, MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-onboarding',
  imports: [
    Logo,
    MatButton,
    MatProgressBar,
    MatRadioButton,
    MatRadioGroup,
    ReactiveFormsModule,
    RouterLink,
    Stepper,
    Step,
    MatLabel,
    MatFormField,
    MatInput,
    MatHint
  ],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss'
})
export class Onboarding {
  private _formBuilder = inject(FormBuilder);

  selectedIndex = signal(0);
  usageTypes = signal([
    {
      type: 'work',
      name: 'For Work'
    },
    {
      type: 'education',
      name: 'For Education'
    },
    {
      type: 'personal',
      name: 'For Personal projects'
    }
  ]);
  workTypes = signal([
    {
      type: 'sales',
      name: 'Sales'
    },
    {
      type: 'design',
      name: 'Design'
    },
    {
      type: 'product',
      name: 'Product'
    },
    {
      type: 'marketing',
      name: 'Marketing'
    },
    {
      type: 'support',
      name: 'Support'
    },
  ]);
  steps = signal<FormGroup[]>([
    this._formBuilder.group({
      usageType: ['', [Validators.required]],
      workType: ['none', [Validators.required]],
    }),
    this._formBuilder.group({
      workspaceName: ['', [Validators.required]]
    }),
  ]);

  selectWorkType(form: FormGroup, workType: string) {
    form.patchValue({ workType });
  }
}
