import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import {
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
  CurrencySelect,
} from '@ng-mf/components';
import { InvoiceStore } from '@invoicely/domain/invoice/store';
import { InvoiceApiService, ClientApiService } from '@invoicely/infrastructure/api';
import { ClientStore } from '@invoicely/domain/client/store';
import { CreateInvoiceRequest } from '@invoicely/domain/invoice/models';

@Component({
  selector: 'app-invoice-create',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButton,
    MatIconButton,
    MatIcon,
    MatRadioModule,
    Panel,
    PanelBody,
    PanelFooter,
    PanelHeader,
    CurrencySelect,
  ],
  templateUrl: './invoice-create.html',
  styleUrl: './invoice-create.scss',
})
export class InvoiceCreate implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  invoiceStore = inject(InvoiceStore);
  clientStore = inject(ClientStore);
  private invoiceApi = inject(InvoiceApiService);
  private clientApi = inject(ClientApiService);

  loading = signal(false);
  submitted = signal(false);

  invoiceForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadClients();
    this.setupCalculations();
  }

  initForm(): void {
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30); // 30 days from now

    this.invoiceForm = this.fb.group({
      clientId: [null, Validators.required],
      issueDate: [today, Validators.required],
      dueDate: [dueDate, Validators.required],
      currencyId: [1, Validators.required], // Default to USD (assuming id 1)
      items: this.fb.array([this.createLineItem()]),
      taxRate: [0, [Validators.min(0), Validators.max(100)]],
      discountType: ['percentage'],
      discount: [0, [Validators.min(0)]],
      notes: [''],
      terms: [''],
    });
  }

  createLineItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      rate: [0, [Validators.required, Validators.min(0)]],
      amount: [{ value: 0, disabled: true }],
    });
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  get subtotal(): number {
    return this.items.controls.reduce((sum, item) => {
      const quantity = item.get('quantity')?.value || 0;
      const rate = item.get('rate')?.value || 0;
      return sum + quantity * rate;
    }, 0);
  }

  get taxAmount(): number {
    const taxRate = this.invoiceForm.get('taxRate')?.value || 0;
    return (this.subtotal * taxRate) / 100;
  }

  get discountAmount(): number {
    const discount = this.invoiceForm.get('discount')?.value || 0;
    const discountType = this.invoiceForm.get('discountType')?.value;

    if (discountType === 'percentage') {
      return (this.subtotal * discount) / 100;
    }
    return discount;
  }

  get total(): number {
    return this.subtotal + this.taxAmount - this.discountAmount;
  }

  setupCalculations(): void {
    // Recalculate line item amounts when quantity or rate changes
    this.items.controls.forEach((item, index) => {
      item.get('quantity')?.valueChanges.subscribe(() => {
        this.updateLineItemAmount(index);
      });
      item.get('rate')?.valueChanges.subscribe(() => {
        this.updateLineItemAmount(index);
      });
    });
  }

  updateLineItemAmount(index: number): void {
    const item = this.items.at(index);
    const quantity = item.get('quantity')?.value || 0;
    const rate = item.get('rate')?.value || 0;
    const amount = quantity * rate;
    item.get('amount')?.setValue(amount, { emitEvent: false });
  }

  addLineItem(): void {
    const newItem = this.createLineItem();
    this.items.push(newItem);

    // Setup calculations for the new item
    const index = this.items.length - 1;
    newItem.get('quantity')?.valueChanges.subscribe(() => {
      this.updateLineItemAmount(index);
    });
    newItem.get('rate')?.valueChanges.subscribe(() => {
      this.updateLineItemAmount(index);
    });
  }

  removeLineItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  loadClients(): void {
    this.clientStore.setLoading(true);
    this.clientApi.getActive().subscribe({
      next: (clients) => {
        this.clientStore.setClients(clients);
        this.clientStore.setLoading(false);
      },
      error: (error) => {
        this.clientStore.setError('Failed to load clients');
        console.error('Failed to load clients:', error);
      },
    });
  }

  saveAsDraft(): void {
    this.submitted.set(true);

    if (this.invoiceForm.invalid) {
      return;
    }

    this.loading.set(true);

    const formValue = this.invoiceForm.getRawValue();
    const invoiceData: CreateInvoiceRequest = {
      clientId: formValue.clientId,
      issueDate: formValue.issueDate.toISOString(),
      dueDate: formValue.dueDate.toISOString(),
      currencyId: formValue.currencyId,
      items: this.items.controls.map((item) => ({
        description: item.get('description')?.value,
        quantity: item.get('quantity')?.value,
        rate: item.get('rate')?.value,
        amount: item.get('quantity')?.value * item.get('rate')?.value,
      })),
      tax: this.taxAmount,
      discount: this.discountAmount,
      notes: formValue.notes,
      terms: formValue.terms,
    };

    this.invoiceApi.create(invoiceData).subscribe({
      next: (invoice) => {
        this.invoiceStore.addInvoice(invoice);
        this.loading.set(false);
        this.router.navigate(['/invoices']);
      },
      error: (error) => {
        this.loading.set(false);
        console.error('Failed to create invoice:', error);
      },
    });
  }

  sendInvoice(): void {
    this.submitted.set(true);

    if (this.invoiceForm.invalid) {
      return;
    }

    this.loading.set(true);

    const formValue = this.invoiceForm.getRawValue();
    const invoiceData: CreateInvoiceRequest = {
      clientId: formValue.clientId,
      issueDate: formValue.issueDate.toISOString(),
      dueDate: formValue.dueDate.toISOString(),
      currencyId: formValue.currencyId,
      items: this.items.controls.map((item) => ({
        description: item.get('description')?.value,
        quantity: item.get('quantity')?.value,
        rate: item.get('rate')?.value,
        amount: item.get('quantity')?.value * item.get('rate')?.value,
      })),
      tax: this.taxAmount,
      discount: this.discountAmount,
      notes: formValue.notes,
      terms: formValue.terms,
    };

    // Create the invoice first
    this.invoiceApi.create(invoiceData).subscribe({
      next: (invoice) => {
        // Then send it
        this.invoiceApi.send(invoice.id).subscribe({
          next: (sentInvoice) => {
            this.invoiceStore.addInvoice(sentInvoice);
            this.loading.set(false);
            this.router.navigate(['/invoices']);
          },
          error: (error) => {
            this.loading.set(false);
            console.error('Failed to send invoice:', error);
          },
        });
      },
      error: (error) => {
        this.loading.set(false);
        console.error('Failed to create invoice:', error);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/invoices']);
  }
}
