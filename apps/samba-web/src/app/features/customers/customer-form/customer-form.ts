import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CustomerService, CustomerStore, CreateCustomerDto, CustomerType } from '@samba/customer-domain';
import { Panel, PanelHeader, PanelBody, OverlayScrollbar, BreadcrumbsStore } from '@ng-mf/components';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    RouterLink,
    Panel,
    PanelHeader,
    PanelBody,
    OverlayScrollbar,
    TitleCasePipe
  ],
  templateUrl: './customer-form.html',
  styleUrl: './customer-form.scss',
})
export class CustomerForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private customerService = inject(CustomerService);
  private customerStore = inject(CustomerStore);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  isLoading = signal(false);
  isEditMode = signal(false);
  error = signal<string | null>(null);
  customerId = signal<number | null>(null);

  customerTypes: CustomerType[] = ['retail', 'wholesale', 'vip'];

  customerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
    email: ['', [Validators.email]],
    address: [''],
    city: [''],
    taxId: [''],
    customerType: ['retail' as CustomerType, Validators.required],
    creditLimit: [0, [Validators.min(0)]],
    notes: [''],
    isActive: [true],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.customerId.set(parseInt(id));
      this.loadCustomer(parseInt(id));
      this.breadcrumbsStore.setBreadcrumbs([
        {
          id: 'home',
          name: 'Home',
          route: '/',
          type: 'link',
        },
        {
          id: 'customers',
          name: 'Customers',
          route: '/customers',
          type: 'link',
        },
        {
          id: 'edit-customer',
          name: 'Edit Customer',
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
          id: 'customers',
          name: 'Customers',
          route: '/customers',
          type: 'link',
        },
        {
          id: 'new-customer',
          name: 'New Customer',
          type: null,
        },
      ]);
    }
  }

  loadCustomer(id: number): void {
    this.isLoading.set(true);
    this.customerService.getById(id).subscribe({
      next: (customer) => {
        this.customerForm.patchValue({
          name: customer.name,
          phone: customer.phone,
          email: customer.email || '',
          address: customer.address || '',
          city: customer.city || '',
          taxId: customer.taxId || '',
          customerType: customer.customerType,
          creditLimit: customer.creditLimit || 0,
          notes: customer.notes || '',
          isActive: customer.isActive,
        });
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading customer:', error);
        this.error.set('Failed to load customer');
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.customerForm.invalid) {
      this.customerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const formValue = this.customerForm.value;
    const customerDto: CreateCustomerDto = {
      name: formValue.name!,
      phone: formValue.phone!,
      email: formValue.email || undefined,
      address: formValue.address || undefined,
      city: formValue.city || undefined,
      taxId: formValue.taxId || undefined,
      customerType: formValue.customerType!,
      creditLimit: formValue.creditLimit || undefined,
      notes: formValue.notes || undefined,
      isActive: formValue.isActive!,
    };

    if (this.isEditMode()) {
      const updateDto = { ...customerDto, id: this.customerId()! };
      this.customerService.update(updateDto).subscribe({
        next: (customer) => {
          this.customerStore.updateCustomer(customer);
          this.router.navigate(['/customers']);
        },
        error: (error) => {
          console.error('Error updating customer:', error);
          this.error.set('Failed to update customer');
          this.isLoading.set(false);
        },
      });
    } else {
      this.customerService.create(customerDto).subscribe({
        next: (customer) => {
          this.customerStore.addCustomer(customer);
          this.router.navigate(['/customers']);
        },
        error: (error) => {
          console.error('Error creating customer:', error);
          this.error.set('Failed to create customer');
          this.isLoading.set(false);
        },
      });
    }
  }

  getErrorMessage(field: string): string {
    const control = this.customerForm.get(field);
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
