import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput, MatPrefix } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatButton } from '@angular/material/button';
import { expiryDateValidator } from '@ng-mf/components';
import {
  CreditCardCvvMaskDirective,
  CreditCardExpiryDateMaskDirective,
  CreditCardNumberMaskDirective
} from '@ng-mf/components';

type CardFormModel = {
  cardNumber: FormControl<string>;
  cardHolderName: FormControl<string>;
  expiryDate: FormControl<string>;
  cvv: FormControl<string>;
  saveCard: FormControl<boolean>;
};

@Component({
  selector: 'app-add-credit-card-form-card',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatIcon,
    MatCheckbox,
    MatButton,
    MatPrefix,
    CreditCardNumberMaskDirective,
    CreditCardExpiryDateMaskDirective,
    CreditCardCvvMaskDirective,
  ],
  templateUrl: './add-credit-card-form-card.html',
  styleUrl: './add-credit-card-form-card.scss',
  host: {
    'class': 'card-container'
  }
})
export class AddCreditCardFormCard {
  private formBuilder = inject(FormBuilder);

  readonly cardForm: FormGroup<CardFormModel> = this.formBuilder.nonNullable.group({
    cardNumber: ['', [
      Validators.required,
      Validators.minLength(16)
    ]],
    cardHolderName: ['', Validators.required],
    expiryDate: ['', [
      Validators.required,
      Validators.pattern(/^\d{4}$/),
      expiryDateValidator
    ]],
    cvv: ['', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(4),
      Validators.pattern(/^\d+$/),
    ]],
    saveCard: [true],
  });

  onSubmit(): void {
    if (this.cardForm.valid) {
      console.log('Form Submitted!', this.cardForm.getRawValue());
    } else {
      this.cardForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
}
