import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { ProductService, ProductStore, Product, CreateProductDto, ProductStatus } from '@samba/product-domain';
import { AuthStore } from '@samba/user-domain';
import { HorizontalDivider } from '@ng-mf/components';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    HorizontalDivider
  ],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss',
})
export class ProductForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private productStore = inject(ProductStore);
  private authStore = inject(AuthStore);

  isLoading = signal(false);
  isEditMode = signal(false);
  error = signal<string | null>(null);
  productId = signal<number | null>(null);

  user = this.authStore.user;

  productForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    sku: ['', [Validators.required, Validators.minLength(2)]],
    barcode: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    costPrice: [0, [Validators.required, Validators.min(0)]],
    categoryId: [1, [Validators.required]],
    supplierId: [null as number | null],
    status: ['active' as ProductStatus, [Validators.required]],
    stockLevel: [0, [Validators.required, Validators.min(0)]],
    lowStockThreshold: [10, [Validators.required, Validators.min(0)]],
    reorderPoint: [20, [Validators.required, Validators.min(0)]],
    maxStockLevel: [100, [Validators.required, Validators.min(0)]],
    unit: ['piece', [Validators.required]],
    description: [''],
    imageUrl: [''],
  });

  statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'discontinued', label: 'Discontinued' },
  ];

  unitOptions = [
    { value: 'piece', label: 'Piece' },
    { value: 'box', label: 'Box' },
    { value: 'kg', label: 'Kilogram' },
    { value: 'liter', label: 'Liter' },
    { value: 'meter', label: 'Meter' },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.productId.set(parseInt(id));
      this.loadProduct(parseInt(id));
    }
  }

  loadProduct(id: number): void {
    this.isLoading.set(true);
    this.productService.getById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          sku: product.sku,
          barcode: product.barcode || '',
          price: product.price,
          costPrice: product.costPrice,
          categoryId: product.categoryId,
          supplierId: product.supplierId || null,
          status: product.status,
          stockLevel: product.stockLevel,
          lowStockThreshold: product.lowStockThreshold,
          reorderPoint: product.reorderPoint,
          maxStockLevel: product.maxStockLevel,
          unit: product.unit,
          description: product.description || '',
          imageUrl: product.imageUrl || '',
        });
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load product');
        this.isLoading.set(false);
      },
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    const formValue = this.productForm.getRawValue();
    const branchId = this.user()?.branchId || 1;

    const productData: CreateProductDto = {
      ...formValue,
      supplierId: formValue.supplierId || undefined,
      barcode: formValue.barcode || undefined,
      description: formValue.description || undefined,
      imageUrl: formValue.imageUrl || undefined,
      branchId,
    };

    if (this.isEditMode() && this.productId()) {
      this.productService
        .update({ ...productData, id: this.productId()! })
        .subscribe({
          next: (product) => {
            this.productStore.updateProduct(product);
            this.router.navigate(['/admin/products']);
          },
          error: (err) => {
            this.error.set(err?.error?.message || 'Failed to update product');
            this.isLoading.set(false);
          },
        });
    } else {
      this.productService.create(productData).subscribe({
        next: (product) => {
          this.productStore.addProduct(product);
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.error.set(err?.error?.message || 'Failed to create product');
          this.isLoading.set(false);
        },
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/products']);
  }

  logout(): void {
    this.router.navigate(['/auth/login']);
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.productForm.get(controlName);
    return !!(
      control &&
      control.hasError(errorName) &&
      (control.dirty || control.touched)
    );
  }

  getErrorMessage(controlName: string): string {
    const control = this.productForm.get(controlName);
    if (!control) return '';

    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('minlength'))
      return `Minimum length is ${control.errors?.['minlength'].requiredLength}`;
    if (control.hasError('min'))
      return `Minimum value is ${control.errors?.['min'].min}`;

    return '';
  }
}
