import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatInputModule, MatPrefix } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import {
  NewCustomerDialog
} from '../new-customer-dialog/new-customer-dialog';
import { currencies } from '../../forms/currency-select';
import { HorizontalDivider } from '../../divider';
import { MatTab, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Alert } from '../../alert';
import { MatDivider } from '@angular/material/divider';

export interface InvoiceItem {
  description: string;
  unitCost: number;
  quantity: number;
  tax: number;
  discount: number;
}

@Component({
  selector: 'mf-invoice-builder',
  exportAs: 'mfInvoiceBuilder',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatTab,
    MatTabGroup,
    MatTabLabel,
    MatSlideToggle,
    Alert,
    HorizontalDivider,
    MatDivider,
  ],
  templateUrl: './invoice-builder.html',
  styleUrl: './invoice-builder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'mf-invoice-builder'
  }
})
export class InvoiceBuilder implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);

  readonly currencies = currencies;

  readonly invoiceForm = this.fb.group({
    invoiceNumber: ['', Validators.required],
    currency: ['USD', Validators.required],
    invoiceDate: [new Date(), Validators.required],
    dueDate: [new Date()],
    items: this.fb.array<FormGroup<any>>([]),
    notes: [''],
    tax: [0],
    company: this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required]],
    }),
    client: this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      address: ['', [Validators.required]],
    }),
    project: this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      showOnInvoice: [true],
    }),
  });

  get isValid(): boolean {
    return this.invoiceForm.valid;
  }

  get itemsArray(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  private formState = toSignal(this.invoiceForm.valueChanges, {
    initialValue: this.invoiceForm.getRawValue(),
  });

  readonly subtotal = computed(() => {
    const items = (this.formState().items ?? []) as InvoiceItem[];
    return items.reduce((acc, item) =>
      acc + (item.unitCost || 0) * (item.quantity || 0),
      0
    ) - this.taxTotal();
  });

  readonly taxTotal = computed(() => {
    return this.total() * (this.formState().tax || 0) / 100;
  });

  readonly total = computed(() => {
    const items = (this.formState().items ?? []) as InvoiceItem[];
    return items.reduce((acc, item) =>
        acc + ((item.unitCost || 0) * (item.quantity || 0) - (item.discount || 0)),
      0
    );
  });

  readonly currency = computed(() => this.formState().currency ?? 'USD');

  readonly currencySymbol = computed(() => {
    const currentCode = this.currency();
    const foundCurrency = this.currencies.find(c => c.code === currentCode);
    return foundCurrency?.symbol ?? currentCode;
  });

  ngOnInit(): void {
    this.invoiceForm.patchValue({
      invoiceNumber: this.generateInvoiceNumber(),
    });
    this.addItem();
  }

  private generateInvoiceNumber(): string {
    const prefix = 'INV';
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const uniqueId = String(Date.now() % 10000).padStart(4, '0');

    return `${prefix}-${year}${month}${day}-${uniqueId}`;
  }

  regenerateInvoiceNumber(): void {
    this.invoiceForm.get('invoiceNumber')?.setValue(this.generateInvoiceNumber());
  }

  createItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      unitCost: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
      discount: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addItem(): void {
    this.itemsArray.push(this.createItem());
  }

  removeItem(index: number): void {
    this.itemsArray.removeAt(index);
  }

  calculateItemAmount(index: number): number {
    const itemGroup = this.itemsArray.at(index) as FormGroup;
    const unitCost = itemGroup.value.unitCost ?? 0;
    const quantity = itemGroup.value.quantity ?? 0;
    return unitCost * quantity;
  }

  addClientDetails() {
    const dialogRef = this.dialog.open(NewCustomerDialog, {
      width: 'clamp(400px, 80vw, 650px)',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        console.log('Dialog result:', result);
      } else {
        console.log('Dialog was closed without creating a client.');
      }
    });
  }
}
