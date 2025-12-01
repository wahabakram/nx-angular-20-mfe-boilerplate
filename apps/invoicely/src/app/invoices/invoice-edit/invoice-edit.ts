import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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
import { Invoice, UpdateInvoiceRequest } from '@invoicely/domain/invoice/models';

@Component({
  selector: 'app-invoice-edit',
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
  templateUrl: './invoice-edit.html',
  styleUrl: './invoice-edit.scss',
})
export class InvoiceEdit implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  invoiceStore = inject(InvoiceStore);
  clientStore = inject(ClientStore);
  private invoiceApi = inject(InvoiceApiService);
  private clientApi = inject(ClientApiService);

  loading = signal(false);
  submitted = signal(false);
  invoiceId = signal<number | null>(null);
  currentInvoice = signal<Invoice | null>(null);

  invoiceForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadClients();
    this.loadInvoice();
  }

  initForm(): void {
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + 30);

    this.invoiceForm = this.fb.group({
      clientId: [null, Validators.required],
      issueDate: [today, Validators.required],
      dueDate: [dueDate, Validators.required],
      currencyId: [1, Validators.required],
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
      id: [null],
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

  loadInvoice(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/invoices']);
      return;
    }

    this.invoiceId.set(+id);
    this.loading.set(true);

    this.invoiceApi.getById(+id).subscribe({
      next: (invoice) => {
        this.currentInvoice.set(invoice);
        this.populateForm(invoice);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Failed to load invoice:', error);
        this.loading.set(false);
        this.router.navigate(['/invoices']);
      },
    });
  }

  populateForm(invoice: Invoice): void {
    // Clear existing items
    while (this.items.length > 0) {
      this.items.removeAt(0);
    }

    // Add invoice items
    invoice.items.forEach((item) => {
      const itemGroup = this.createLineItem();
      itemGroup.patchValue({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        rate: item.rate,
        amount: item.amount,
      });
      this.items.push(itemGroup);
    });

    // Calculate discount type and value
    let discountType = 'percentage';
    let discountValue = 0;

    if (invoice.discount > 0) {
      discountType = invoice.discountType;
      if (discountType === 'percentage') {
        discountValue = (invoice.discount / invoice.subtotal) * 100;
      } else {
        discountValue = invoice.discount;
      }
    }

    // Calculate tax rate
    const taxRate = invoice.subtotal > 0 ? (invoice.tax / invoice.subtotal) * 100 : 0;

    // Populate form
    this.invoiceForm.patchValue({
      clientId: invoice.clientId,
      issueDate: new Date(invoice.issueDate),
      dueDate: new Date(invoice.dueDate),
      currencyId: invoice.currencyId,
      taxRate: taxRate,
      discountType: discountType,
      discount: discountValue,
      notes: invoice.notes || '',
      terms: invoice.terms || '',
    });

    // Setup calculations for all items
    this.setupCalculations();
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

  saveChanges(): void {
    this.submitted.set(true);

    if (this.invoiceForm.invalid || !this.invoiceId()) {
      return;
    }

    this.loading.set(true);

    const formValue = this.invoiceForm.getRawValue();
    const invoiceData: UpdateInvoiceRequest = {
      clientId: formValue.clientId,
      issueDate: formValue.issueDate.toISOString(),
      dueDate: formValue.dueDate.toISOString(),
      currencyId: formValue.currencyId,
      items: this.items.controls.map((item) => ({
        id: item.get('id')?.value,
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

    this.invoiceApi.update(this.invoiceId()!, invoiceData).subscribe({
      next: (invoice) => {
        this.invoiceStore.updateInvoice(this.invoiceId()!, invoice);
        this.loading.set(false);
        this.router.navigate(['/invoices']);
      },
      error: (error) => {
        this.loading.set(false);
        console.error('Failed to update invoice:', error);
      },
    });
  }

  saveAndSend(): void {
    this.submitted.set(true);

    if (this.invoiceForm.invalid || !this.invoiceId()) {
      return;
    }

    this.loading.set(true);

    const formValue = this.invoiceForm.getRawValue();
    const invoiceData: UpdateInvoiceRequest = {
      clientId: formValue.clientId,
      issueDate: formValue.issueDate.toISOString(),
      dueDate: formValue.dueDate.toISOString(),
      currencyId: formValue.currencyId,
      items: this.items.controls.map((item) => ({
        id: item.get('id')?.value,
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

    // Update the invoice first
    this.invoiceApi.update(this.invoiceId()!, invoiceData).subscribe({
      next: (invoice) => {
        // Then send it
        this.invoiceApi.send(invoice.id).subscribe({
          next: (sentInvoice) => {
            this.invoiceStore.updateInvoice(this.invoiceId()!, sentInvoice);
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
        console.error('Failed to update invoice:', error);
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/invoices']);
  }
}
