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
import { DecimalPipe } from '@angular/common';
import { Product, ProductApi, ProductStore } from '@samba/product-domain';
import { CustomerApi, CustomerStore } from '@samba/customer-domain';
import {
  Sale,
  CreateSaleDto,
  UpdateSaleDto,
  CreateSaleItemDto,
  PaymentMethod,
  PaymentStatus,
  SaleApi,
  SaleStore,
} from '@samba/sale-domain';
import { AuthStore } from '@samba/user-domain';
import { LedgerApi } from '@samba/ledger-domain';
import { InventoryApi } from '@samba/inventory-domain';
import { Page } from '../../../_partials/page/page';

interface SaleFormItem {
  product: Product | null;
  productId: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

@Component({
  selector: 'app-sale-form',
  standalone: true,
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
    Page,
    DecimalPipe,
  ],
  templateUrl: './sale-form.html',
  styleUrl: './sale-form.scss',
})
export class SaleForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authStore = inject(AuthStore);
  private productApi = inject(ProductApi);
  private productStore = inject(ProductStore);
  private customerApi = inject(CustomerApi);
  private customerStore = inject(CustomerStore);
  private saleApi = inject(SaleApi);
  private saleStore = inject(SaleStore);
  private ledgerApi = inject(LedgerApi);
  private inventoryApi = inject(InventoryApi);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  saleId = signal<number | null>(null);
  isEdit = signal(false);
  saleForm!: FormGroup;

  products = this.productStore.products;
  customers = this.customerStore.customers;

  filteredProducts = signal<Product[]>([]);
  productSearchTerm = signal('');

  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);

  paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'bank-transfer', label: 'Bank Transfer' },
    { value: 'credit', label: 'Credit' },
  ];

  paymentStatuses: { value: PaymentStatus; label: string }[] = [
    { value: 'paid', label: 'Paid' },
    { value: 'partial', label: 'Partial' },
    { value: 'pending', label: 'Pending' },
  ];

  // Computed values
  subtotal = computed(() => {
    const items = this.saleForm?.get('items')?.value || [];
    return items.reduce(
      (sum: number, item: SaleFormItem) => sum + (item.subtotal || 0),
      0
    );
  });

  taxAmount = computed(() => {
    const rate = this.saleForm?.get('taxRate')?.value || 0;
    return this.subtotal() * rate;
  });

  discountAmount = computed(() => {
    const rate = this.saleForm?.get('discountRate')?.value || 0;
    return this.subtotal() * rate;
  });

  total = computed(() => {
    return this.subtotal() + this.taxAmount() - this.discountAmount();
  });

  ngOnInit() {
    this.initForm();
    this.loadData();
    this.checkRouteParams();
    this.setupProductSearch();
  }

  private initForm() {
    this.saleForm = this.fb.group({
      customerId: [null],
      items: this.fb.array([]),
      taxRate: [0.1, [Validators.min(0), Validators.max(1)]],
      discountRate: [0, [Validators.min(0), Validators.max(1)]],
      paymentMethod: ['cash', Validators.required],
      paymentStatus: ['paid', Validators.required],
      notes: [''],
      saleDate: [new Date(), Validators.required],
    });
  }

  private loadData() {
    this.isLoading.set(true);

    // Load products
    this.productApi.getAll().subscribe({
      next: () => {
        this.filteredProducts.set(this.products().slice(0, 20));
      },
      error: (err) => console.error('Failed to load products:', err),
    });

    // Load customers
    this.customerApi.getAll().subscribe({
      error: (err) => console.error('Failed to load customers:', err),
    });

    this.isLoading.set(false);
  }

  private checkRouteParams() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.saleId.set(+id);
      this.isEdit.set(true);
      this.loadSale(+id);
      this.updateBreadcrumbs('Edit Sale');
    } else {
      // Check if coming from quotation conversion
      const navigation = this.router.getCurrentNavigation();
      const state = navigation?.extras?.state || window.history.state;

      if (state && state['fromQuotation'] && state['quotationData']) {
        this.populateFromQuotation(state['quotationData']);
        this.updateBreadcrumbs('New Sale (From Quotation)');
      } else {
        this.updateBreadcrumbs('New Sale');
        // Add one empty item by default
        this.addItem();
      }
    }
  }

  private populateFromQuotation(quotationData: any) {
    // Populate form with quotation data
    this.saleForm.patchValue({
      customerId: quotationData.customerId,
      taxRate: quotationData.taxRate,
      discountRate: quotationData.discountRate,
      notes: quotationData.notes || '',
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      saleDate: new Date(),
    });

    // Populate items
    const itemsArray = this.saleForm.get('items') as FormArray;
    itemsArray.clear();

    quotationData.items?.forEach((item: any) => {
      const itemGroup = this.fb.group({
        product: [item.product || null],
        productId: [item.productId, Validators.required],
        quantity: [item.quantity, [Validators.required, Validators.min(1)]],
        unitPrice: [item.unitPrice, [Validators.required, Validators.min(0)]],
        discount: [item.discount || 0, [Validators.min(0)]],
        subtotal: [item.subtotal || 0],
      });

      // Subscribe to value changes
      itemGroup.valueChanges.subscribe(() => {
        this.calculateItemSubtotal(itemGroup);
      });

      itemsArray.push(itemGroup);
    });
  }

  private loadSale(id: number) {
    this.isLoading.set(true);
    this.saleApi.getById(id).subscribe({
      next: (sale) => {
        this.populateForm(sale);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load sale');
        console.error('Failed to load sale:', err);
        this.isLoading.set(false);
      },
    });
  }

  private populateForm(sale: Sale) {
    this.saleForm.patchValue({
      customerId: sale.customerId,
      taxRate: sale.taxRate,
      discountRate: sale.discountRate,
      paymentMethod: sale.paymentMethod,
      paymentStatus: sale.paymentStatus,
      notes: sale.notes,
      saleDate: sale.saleDate,
    });

    // Populate items
    const itemsArray = this.saleForm.get('items') as FormArray;
    itemsArray.clear();

    sale.items.forEach((item) => {
      itemsArray.push(
        this.fb.group({
          product: [item.product],
          productId: [item.productId, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]],
          unitPrice: [item.unitPrice, [Validators.required, Validators.min(0)]],
          discount: [item.discount, [Validators.min(0)]],
          subtotal: [item.subtotal],
        })
      );
    });
  }

  private updateBreadcrumbs(title: string) {
    this.breadcrumbsStore.setBreadcrumbs([
      { id: 'home', name: 'Home', route: '/', type: 'link' },
      { id: 'sales', name: 'Sales', route: '/sales', type: 'link' },
      { id: 'form', name: title, type: null },
    ]);
  }

  private setupProductSearch() {
    // Could add debounced search logic here
  }

  get itemsArray(): FormArray {
    return this.saleForm.get('items') as FormArray;
  }

  addItem() {
    const itemGroup = this.fb.group({
      product: [null],
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
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
      unitPrice: product.price,
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
    const unitPrice = itemGroup.get('unitPrice')?.value || 0;
    const discount = itemGroup.get('discount')?.value || 0;

    const subtotal = quantity * unitPrice - discount;
    itemGroup.patchValue({ subtotal }, { emitEvent: false });
  }

  onSubmit() {
    if (this.saleForm.invalid) {
      this.saleForm.markAllAsTouched();
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

    const formValue = this.saleForm.value;
    const items: CreateSaleItemDto[] = formValue.items.map(
      (item: SaleFormItem) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        subtotal: item.subtotal,
      })
    );

    if (this.isEdit() && this.saleId()) {
      this.updateSale(items);
    } else {
      this.createSale(items, user.id);
    }
  }

  private createSale(items: CreateSaleItemDto[], userId: number) {
    const saleData: CreateSaleDto = {
      branchId: 1, // TODO: Get from auth store or branch selection
      userId: userId,
      customerId: this.saleForm.value.customerId || undefined,
      items: items,
      subtotal: this.subtotal(),
      tax: this.taxAmount(),
      taxRate: this.saleForm.value.taxRate,
      discount: this.discountAmount(),
      discountRate: this.saleForm.value.discountRate,
      total: this.total(),
      paymentMethod: this.saleForm.value.paymentMethod,
      paymentStatus: this.saleForm.value.paymentStatus,
      notes: this.saleForm.value.notes || undefined,
    };

    this.saleApi.create(saleData).subscribe({
      next: (sale) => {
        // Auto-adjust stock for sold items
        this.adjustStockForSale(sale, userId);
      },
      error: (err) => {
        this.error.set('Failed to create sale');
        console.error('Failed to create sale:', err);
        this.isSaving.set(false);
      },
    });
  }

  private adjustStockForSale(sale: Sale, userId: number) {
    // Create inventory adjustments for each item sold
    let completedAdjustments = 0;
    const totalItems = sale.items.length;

    if (totalItems === 0) {
      // No items, proceed to ledger entry
      this.proceedAfterStockAdjustment(sale, userId);
      return;
    }

    sale.items.forEach((item) => {
      const adjustment = {
        productId: item.productId,
        branchId: sale.branchId,
        adjustmentType: 'decrease' as const,
        quantity: item.quantity,
        previousStock: 0, // Will be calculated by backend
        newStock: 0, // Will be calculated by backend
        reason: `Sale #${sale.id}`,
        userId: userId,
      };

      this.inventoryApi.createAdjustment(adjustment).subscribe({
        next: () => {
          completedAdjustments++;
          console.log(`Stock adjusted for product ${item.productId}: -${item.quantity}`);

          // Check if all adjustments are complete
          if (completedAdjustments === totalItems) {
            this.proceedAfterStockAdjustment(sale, userId);
          }
        },
        error: (err) => {
          console.error(`Failed to adjust stock for product ${item.productId}:`, err);
          completedAdjustments++;

          // Continue even if adjustment fails
          if (completedAdjustments === totalItems) {
            this.proceedAfterStockAdjustment(sale, userId);
          }
        },
      });
    });
  }

  private proceedAfterStockAdjustment(sale: Sale, userId: number) {
    // Auto-create ledger entry if customer is assigned
    if (sale.customerId) {
      this.createLedgerEntryForSale(sale, userId);
    } else {
      this.isSaving.set(false);
      this.router.navigate(['/sales']);
    }
  }

  private createLedgerEntryForSale(sale: Sale, userId: number) {
    if (!sale.customerId) {
      console.warn('Cannot create ledger entry: No customer assigned to sale');
      this.isSaving.set(false);
      this.router.navigate(['/sales']);
      return;
    }

    const description = `Sale #${sale.id} - ${this.getPaymentMethodLabel(sale.paymentMethod)}${sale.paymentStatus === 'paid' ? ' (Paid)' : ' (Unpaid)'}`;

    const ledgerEntry = {
      customerId: sale.customerId,
      transactionType: 'SALE' as const,
      transactionDate: sale.saleDate,
      referenceId: sale.id,
      referenceType: 'sale' as const,
      debit: sale.total, // Customer owes money
      credit: 0,
      description: description,
      branchId: sale.branchId,
      userId: userId,
    };

    this.ledgerApi.createEntry(ledgerEntry).subscribe({
      next: () => {
        console.log('Ledger entry created for sale:', sale.id);
        this.isSaving.set(false);
        this.router.navigate(['/sales']);
      },
      error: (err) => {
        console.error('Failed to create ledger entry:', err);
        // Still navigate even if ledger entry fails
        this.isSaving.set(false);
        this.router.navigate(['/sales']);
      },
    });
  }

  private getPaymentMethodLabel(method: PaymentMethod): string {
    const found = this.paymentMethods.find((m) => m.value === method);
    return found?.label || method;
  }

  private updateSale(items: CreateSaleItemDto[]) {
    const updateData: UpdateSaleDto = {
      id: this.saleId()!,
      customerId: this.saleForm.value.customerId || undefined,
      items: items,
      subtotal: this.subtotal(),
      tax: this.taxAmount(),
      taxRate: this.saleForm.value.taxRate,
      discount: this.discountAmount(),
      discountRate: this.saleForm.value.discountRate,
      total: this.total(),
      paymentMethod: this.saleForm.value.paymentMethod,
      paymentStatus: this.saleForm.value.paymentStatus,
      notes: this.saleForm.value.notes || undefined,
    };

    this.saleApi.update(updateData).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/sales']);
      },
      error: (err) => {
        this.error.set('Failed to update sale');
        console.error('Failed to update sale:', err);
        this.isSaving.set(false);
      },
    });
  }

  onCancel() {
    this.router.navigate(['/sales']);
  }
}
