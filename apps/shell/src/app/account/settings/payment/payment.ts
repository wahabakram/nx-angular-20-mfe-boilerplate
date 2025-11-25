import { Component, signal, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';

import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule, MatPrefix } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CountrySelect } from '@ng-mf/components';
import {
  CreditCardCvvMaskDirective,
  CreditCardExpiryDateMaskDirective,
  CreditCardNumberMaskDirective,
} from '@ng-mf/components';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';
import { BreadcrumbsStore } from '@ng-mf/components';
import {
  SAVED_CARDS,
  SavedCard,
} from '@/account/settings/mock-data/payment.mock';

@Component({
  imports: [
    MatButton,
    ReactiveFormsModule,
    NgOptimizedImage,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatPrefix,
    CountrySelect,
    CreditCardNumberMaskDirective,
    CreditCardExpiryDateMaskDirective,
    CreditCardCvvMaskDirective,
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export class Payment {
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private readonly formBuilder = inject(FormBuilder);

  readonly savedCards = signal<SavedCard[]>(SAVED_CARDS);

  readonly paymentForm = this.formBuilder.group({
    cardInfo: this.formBuilder.group({
      cardHolderName: ['Pavel Salauyou'],
      cardNumber: ['1234 5678 9012 0000'],
      cvv: ['549'],
      expiryDate: ['12/2029'],
    }),
    address: this.formBuilder.group({
      email: ['hello@example.com'],
      physicalAddress: ['221b Elementar Street, 10587'],
      cityProvince: ['New York, NY'],
      country: ['US'],
    }),
    settings: this.formBuilder.group({
      autoSaveCard: [true],
      notifyCard: [false],
    }),
  });

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'account',
        name: 'Account',
        route: '/account/settings',
        type: 'link',
      },
      {
        id: 'payment',
        name: 'Payment',
        type: null,
      },
    ]);
    this.paymentForm.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe((value) => {
        console.log('Form value changed, ready to save:', value);
      });
  }

  addNewCreditCard(): void {
    console.log('Adding a new credit card');
  }

  deleteCard(cardToDelete: SavedCard): void {
    this.savedCards.update((cards) =>
      cards.filter((card) => card !== cardToDelete)
    );
  }

  editCard(cardToEdit: SavedCard): void {
    console.log('Editing card:', cardToEdit);
  }
}
