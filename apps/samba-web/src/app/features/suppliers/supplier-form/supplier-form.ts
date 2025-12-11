import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Icon } from '@ng-mf/components';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SupplierApi, SupplierStore, CreateSupplierDto, SupplierStatus } from '@samba/supplier-domain';
import { Panel, PanelHeader, PanelBody, OverlayScrollbar, BreadcrumbsStore } from '@ng-mf/components';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-supplier-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    Icon,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    RouterLink,
    Panel,
    PanelHeader,
    PanelBody,
    OverlayScrollbar,
    TitleCasePipe
  ],
  templateUrl: './supplier-form.html',
  styleUrl: './supplier-form.scss',
})
export class SupplierForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private supplierApi = inject(SupplierApi);
  private supplierStore = inject(SupplierStore);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  isLoading = signal(false);
  isEditMode = signal(false);
  error = signal<string | null>(null);
  supplierId = signal<number | null>(null);

  statuses: SupplierStatus[] = ['active', 'inactive', 'blocked'];

  supplierForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    companyName: [''],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
    email: ['', [Validators.email]],
    address: [''],
    city: [''],
    country: [''],
    taxId: [''],
    paymentTerms: [''],
    creditLimit: [0, [Validators.min(0)]],
    notes: [''],
    status: ['active' as SupplierStatus, Validators.required],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.supplierId.set(parseInt(id));
      this.loadSupplier(parseInt(id));
      this.breadcrumbsStore.setBreadcrumbs([
        {
          id: 'home',
          name: 'Home',
          route: '/',
          type: 'link',
        },
        {
          id: 'suppliers',
          name: 'Suppliers',
          route: '/suppliers',
          type: 'link',
        },
        {
          id: 'edit-supplier',
          name: 'Edit Supplier',
          type: null,
        },
      ]);
    } else {
      this.breadcrumbsStore.setBreadcrumbs([
        {
          id: 'home',
          name: 'Home',
          route: '/',
          type: 'link',
        },
        {
          id: 'suppliers',
          name: 'Suppliers',
          route: '/suppliers',
          type: 'link',
        },
        {
          id: 'new-supplier',
          name: 'New Supplier',
          type: null,
        },
      ]);
    }
  }

  loadSupplier(id: number): void {
    this.isLoading.set(true);
    this.supplierApi.getById(id).subscribe({
      next: (supplier) => {
        this.supplierForm.patchValue({
          name: supplier.name,
          companyName: supplier.companyName || '',
          phone: supplier.phone,
          email: supplier.email || '',
          address: supplier.address || '',
          city: supplier.city || '',
          country: supplier.country || '',
          taxId: supplier.taxId || '',
          paymentTerms: supplier.paymentTerms || '',
          creditLimit: supplier.creditLimit || 0,
          notes: supplier.notes || '',
          status: supplier.status,
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading supplier:', error);
        this.error.set('Failed to load supplier');
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const formValue = this.supplierForm.value;
    const supplierDto: CreateSupplierDto = {
      name: formValue.name!,
      companyName: formValue.companyName || undefined,
      phone: formValue.phone!,
      email: formValue.email || undefined,
      address: formValue.address || undefined,
      city: formValue.city || undefined,
      country: formValue.country || undefined,
      taxId: formValue.taxId || undefined,
      paymentTerms: formValue.paymentTerms || undefined,
      creditLimit: formValue.creditLimit || undefined,
      notes: formValue.notes || undefined,
      status: formValue.status!,
    };

    if (this.isEditMode()) {
      this.supplierApi.update(this.supplierId()!, supplierDto).subscribe({
        next: (supplier) => {
          this.supplierStore.updateSupplier(this.supplierId()!, supplier);
          this.router.navigate(['/suppliers']);
        },
        error: (error) => {
          console.error('Error updating supplier:', error);
          this.error.set('Failed to update supplier');
          this.isLoading.set(false);
        },
      });
    } else {
      this.supplierApi.create(supplierDto).subscribe({
        next: (supplier) => {
          this.supplierStore.addSupplier(supplier);
          this.router.navigate(['/suppliers']);
        },
        error: (error) => {
          console.error('Error creating supplier:', error);
          this.error.set('Failed to create supplier');
          this.isLoading.set(false);
        },
      });
    }
  }

  getErrorMessage(field: string): string {
    const control = this.supplierForm.get(field);
    if (control?.hasError('required')) {
      return 'This field is required';
    }
    if (control?.hasError('minlength')) {
      return 'Minimum length not met';
    }
    if (control?.hasError('email')) {
      return 'Invalid email address';
    }
    if (control?.hasError('pattern')) {
      return 'Invalid format';
    }
    if (control?.hasError('min')) {
      return 'Value must be greater than or equal to 0';
    }
    return '';
  }
}
