import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { BreadcrumbsStore } from '@ng-mf/components';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Product, ProductApi, ProductStore } from '@samba/product-domain';
import { SupplierApi, SupplierStore } from '@samba/supplier-domain';
import {
  Purchase,
  CreatePurchaseDto,
  CreatePurchaseItemDto,
  PurchaseApi,
  PurchaseStore,
} from '@samba/purchase-domain';
import { AuthStore } from '@samba/user-domain';
import { Page } from '../../../_partials/page/page';

interface PurchaseFormItem {
  product: Product | null;
  productId: number;
  quantity: number;
  unitCost: number;
  discount: number;
  subtotal: number;
}

@Component({
  selector: 'app-purchase-form',
  imports: [
    ReactiveFormsModule,
    MatButton,
    Icon,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatSelect,
    MatOption,
    MatProgressSpinner,
    MatTooltip,
    MatDatepickerModule,
    Page,
    DecimalPipe,
    DatePipe,
  ],
  templateUrl: './purchase-form.html',
  styleUrl: './purchase-form.scss',
})
export class PurchaseForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authStore = inject(AuthStore);
  private productApi = inject(ProductApi);
  private productStore = inject(ProductStore);
  private supplierApi = inject(SupplierApi);
  private supplierStore = inject(SupplierStore);
  private purchaseApi = inject(PurchaseApi);
  private purchaseStore = inject(PurchaseStore);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  purchaseId = signal<number | null>(null);
  isEdit = signal(false);
  purchaseForm!: FormGroup;

  products = this.productStore.products;
  suppliers = this.supplierStore.suppliers;

  filteredProducts = signal<Product[]>([]);
  productSearchTerm = signal('');

  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);

  // Computed values
  subtotal = computed(() => {
    const items = this.purchaseForm?.get('items')?.value || [];
    return items.reduce(
      (sum: number, item: PurchaseFormItem) => sum + (item.subtotal || 0),
      0
    );
  });

  taxAmount = computed(() => {
    const rate = this.purchaseForm?.get('taxRate')?.value || 0;
    return this.subtotal() * rate;
  });

  discountAmount = computed(() => {
    const rate = this.purchaseForm?.get('discountRate')?.value || 0;
    return this.subtotal() * rate;
  });

  shippingCost = computed(() => {
    return this.purchaseForm?.get('shippingCost')?.value || 0;
  });

  total = computed(() => {
    return this.subtotal() + this.taxAmount() - this.discountAmount() + this.shippingCost();
  });

  ngOnInit() {
    this.initForm();
    this.loadData();
    this.checkRouteParams();
  }

  private initForm() {
    this.purchaseForm = this.fb.group({
      supplierId: [null, Validators.required],
      items: this.fb.array([]),
      purchaseDate: [new Date(), Validators.required],
      expectedDeliveryDate: [null],
      taxRate: [0, [Validators.min(0), Validators.max(1)]],
      discountRate: [0, [Validators.min(0), Validators.max(1)]],
      shippingCost: [0, [Validators.min(0)]],
      invoiceNumber: [''],
      notes: [''],
    });
  }

  private loadData() {
    this.isLoading.set(true);

    // Load products
    this.productApi.getAll().subscribe({
      next: () => {
        this.filteredProducts.set(this.products().slice(0, 20));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products:', err);
        this.isLoading.set(false);
      },
    });

    // Load suppliers
    this.supplierApi.getAll().subscribe({
      error: (err) => console.error('Failed to load suppliers:', err),
    });
  }

  private checkRouteParams() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.purchaseId.set(+id);
      this.isEdit.set(true);
      this.loadPurchase(+id);
      this.updateBreadcrumbs('Edit Purchase Order');
    } else {
      this.updateBreadcrumbs('New Purchase Order');
      // Add one empty item by default
      this.addItem();
    }
  }

  private loadPurchase(id: number) {
    this.isLoading.set(true);
    this.purchaseApi.getById(id).subscribe({
      next: (purchase) => {
        this.populateForm(purchase);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load purchase order');
        console.error('Failed to load purchase:', err);
        this.isLoading.set(false);
      },
    });
  }

  private populateForm(purchase: Purchase) {
    this.purchaseForm.patchValue({
      supplierId: purchase.supplierId,
      purchaseDate: purchase.purchaseDate,
      expectedDeliveryDate: purchase.expectedDeliveryDate,
      taxRate: purchase.taxRate,
      discountRate: purchase.discountRate,
      shippingCost: purchase.shippingCost,
      invoiceNumber: purchase.invoiceNumber,
      notes: purchase.notes,
    });

    // Populate items
    const itemsArray = this.purchaseForm.get('items') as FormArray;
    itemsArray.clear();

    purchase.items.forEach((item) => {
      const itemGroup = this.fb.group({
        product: [item.product],
        productId: [item.productId, Validators.required],
        quantity: [item.quantity, [Validators.required, Validators.min(1)]],
        unitCost: [item.unitCost, [Validators.required, Validators.min(0)]],
        discount: [item.discount || 0, [Validators.min(0)]],
        subtotal: [item.subtotal],
      });

      // Subscribe to value changes
      itemGroup.valueChanges.subscribe(() => {
        this.calculateItemSubtotal(itemGroup);
      });

      itemsArray.push(itemGroup);
    });
  }

  private updateBreadcrumbs(title: string) {
    this.breadcrumbsStore.setBreadcrumbs([
      { id: 'home', name: 'Home', route: '/', type: 'link' },
      { id: 'purchases', name: 'Purchases', route: '/purchases', type: 'link' },
      { id: 'form', name: title, type: null },
    ]);
  }

  get itemsArray(): FormArray {
    return this.purchaseForm.get('items') as FormArray;
  }

  addItem() {
    const itemGroup = this.fb.group({
      product: [null],
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitCost: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0)]],
      subtotal: [0],
    });

    // Subscribe to value changes to calculate subtotal
    itemGroup.valueChanges.subscribe(() => {
      this.calculateItemSubtotal(itemGroup);
    });

    this.itemsArray.push(itemGroup);
  }

  removeItem(index: number) {
    this.itemsArray.removeAt(index);
  }

  onProductSelected(productId: number, index: number) {
    const product = this.products().find((p) => p.id === productId);
    if (!product) return;

    const itemGroup = this.itemsArray.at(index) as FormGroup;
    itemGroup.patchValue({
      product: product,
      productId: product.id,
      unitCost: product.price, // Use product price as unit cost
      quantity: 1,
    });

    this.calculateItemSubtotal(itemGroup);
  }

  onProductSearch(term: string) {
    this.productSearchTerm.set(term);
    if (!term) {
      this.filteredProducts.set(this.products().slice(0, 20));
      return;
    }

    const searchTerm = term.toLowerCase();
    const filtered = this.products().filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.sku?.toLowerCase().includes(searchTerm) ||
        p.barcode?.toLowerCase().includes(searchTerm)
    );
    this.filteredProducts.set(filtered.slice(0, 20));
  }

  private calculateItemSubtotal(itemGroup: FormGroup) {
    const quantity = itemGroup.get('quantity')?.value || 0;
    const unitCost = itemGroup.get('unitCost')?.value || 0;
    const discount = itemGroup.get('discount')?.value || 0;

    const subtotal = quantity * unitCost - discount;
    itemGroup.patchValue({ subtotal }, { emitEvent: false });
  }

  onSubmit() {
    if (this.purchaseForm.invalid) {
      this.purchaseForm.markAllAsTouched();
      this.error.set('Please fill all required fields');
      return;
    }

    const user = this.authStore.user();
    if (!user) {
      this.error.set('User not authenticated');
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    const formValue = this.purchaseForm.value;
    const items: CreatePurchaseItemDto[] = formValue.items.map(
      (item: PurchaseFormItem) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitCost: item.unitCost,
        discount: item.discount || 0,
      })
    );

    const purchaseData: CreatePurchaseDto = {
      branchId: 1, // TODO: Get from auth store or branch selection
      userId: user.id,
      supplierId: formValue.supplierId,
      purchaseDate: formValue.purchaseDate,
      expectedDeliveryDate: formValue.expectedDeliveryDate || undefined,
      items: items,
      taxRate: formValue.taxRate,
      discountRate: formValue.discountRate,
      shippingCost: formValue.shippingCost || 0,
      invoiceNumber: formValue.invoiceNumber || undefined,
      notes: formValue.notes || undefined,
    };

    this.purchaseApi.create(purchaseData).subscribe({
      next: (purchase) => {
        this.purchaseStore.addPurchase(purchase);
        this.router.navigate(['/purchases']);
      },
      error: (err) => {
        this.error.set('Failed to create purchase order');
        console.error('Failed to create purchase:', err);
        this.isSaving.set(false);
      },
    });
  }

  cancel() {
    this.router.navigate(['/purchases']);
  }
}
