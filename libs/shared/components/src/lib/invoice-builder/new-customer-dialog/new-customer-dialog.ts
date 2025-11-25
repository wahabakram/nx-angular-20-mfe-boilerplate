import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CountrySelect } from '../../forms/country-select';
import { PhoneInput } from '../../forms/phone-input';

@Component({
  selector: 'mf-new-customer-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatIconModule,
    CountrySelect,
    PhoneInput,
  ],
  templateUrl: './new-customer-dialog.html',
  styleUrl: './new-customer-dialog.scss'
})
export class NewCustomerDialog {
  private readonly fb = inject(FormBuilder);
  public readonly dialogRef = inject(MatDialogRef<NewCustomerDialog>);

  readonly form = this.fb.nonNullable.group({
    country: ['US', Validators.required],
    customerName: ['', Validators.required],
    companyId: [''],
    taxId: [''],
    vatId: [''],
    vatPayerType: ['VAT payer', Validators.required],
    street: ['', Validators.required],
    municipality: ['', Validators.required],
    postalCode: ['', Validators.required],
    addressCountry: ['Slovakia', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    companyWeb: [''],
    phoneNumber: [''],
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }
}
