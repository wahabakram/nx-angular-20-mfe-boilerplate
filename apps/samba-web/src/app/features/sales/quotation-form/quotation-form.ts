import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbsStore, Icon } from '@ng-mf/components';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatError, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { DecimalPipe } from '@angular/common';
import { Product, ProductApi, ProductStore } from '@samba/product-domain';
import { CustomerApi, CustomerStore } from '@samba/customer-domain';
import { Page } from '../../../_partials/page/page';

// Quotation interface (matching quotation-list)
interface Quotation {
  id?: number;
  quotationNumber?: string;
  customerId: number;
  customerName?: string;
  items: QuotationItem[];
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  discount?: number;
  discountRate: number;
  totalAmount: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  notes?: string;
  createdAt?: string;
}

interface QuotationItem {
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

@Component({
  selector: 'app-quotation-form',
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
    DecimalPipe,
    Page,
    Icon,
    MatPrefix
],
  templateUrl: './quotation-form.html',
  styleUrl: './quotation-form.scss'
})
export class QuotationForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private productService = inject(ProductApi);
  private productStore = inject(ProductStore);
  private customerApi = inject(CustomerApi);
  private customerStore = inject(CustomerStore);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  quotationId = signal<number | null>(null);
  isEdit = signal(false);
  quotationForm!: FormGroup;

  products = this.productStore.products;
  customers = this.customerStore.customers;
  filteredProducts = signal<Product[]>([]);

  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);

  statuses: { value: string; label: string }[] = [
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'rejected', label: 'Rejected' },
  ];

  // Computed values
  subtotal = computed(() => {
    const items = this.quotationForm?.get('items')?.value || [];
    return items.reduce((sum: number, item: QuotationItem) => sum + (item.subtotal || 0), 0);
  });

  taxAmount = computed(() => {
    const rate = this.quotationForm?.get('taxRate')?.value || 0;
    return this.subtotal() * rate;
  });

  discountAmount = computed(() => {
    const rate = this.quotationForm?.get('discountRate')?.value || 0;
    return this.subtotal() * rate;
  });

  total = computed(() => {
    return this.subtotal() + this.taxAmount() - this.discountAmount();
  });

  ngOnInit() {
    this.initForm();
    this.loadData();
    this.checkRouteParams();
  }

  private initForm() {
    // Set default validUntil to 30 days from now
    const defaultValidUntil = new Date();
    defaultValidUntil.setDate(defaultValidUntil.getDate() + 30);

    this.quotationForm = this.fb.group({
      customerId: [null, Validators.required],
      items: this.fb.array([]),
      taxRate: [0.1, [Validators.min(0), Validators.max(1)]],
      discountRate: [0, [Validators.min(0), Validators.max(1)]],
      validUntil: [defaultValidUntil.toISOString().split('T')[0], Validators.required],
      status: ['draft', Validators.required],
      notes: ['']
    });
  }

  private loadData() {
    this.isLoading.set(true);

    // Load products
    this.productService.getAll().subscribe({
      next: () => {
        this.filteredProducts.set(this.products().slice(0, 20));
      },
      error: (err) => console.error('Failed to load products:', err)
    });

    // Load customers
    this.customerApi.getAll().subscribe({
      error: (err) => console.error('Failed to load customers:', err)
    });

    this.isLoading.set(false);
  }

  private checkRouteParams() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.quotationId.set(+id);
      this.isEdit.set(true);
      this.loadQuotation(+id);
      this.updateBreadcrumbs('Edit Quotation');
    } else {
      this.updateBreadcrumbs('New Quotation');
      // Add one empty item by default
      this.addItem();
    }
  }

  private loadQuotation(id: number) {
    this.isLoading.set(true);
    // TODO: Implement quotation service to load quotation
    // For now, mock data
    this.isLoading.set(false);
  }

  private updateBreadcrumbs(title: string) {
    this.breadcrumbsStore.setBreadcrumbs([
      { id: 'home', name: 'Home', route: '/', type: 'link' },
      { id: 'sales', name: 'Sales', route: '/sales', type: 'link' },
      { id: 'quotations', name: 'Quotations', route: '/sales/quotations', type: 'link' },
      { id: 'form', name: title, type: null }
    ]);
  }

  get itemsArray(): FormArray {
    return this.quotationForm.get('items') as FormArray;
  }

  addItem() {
    const itemGroup = this.fb.group({
      product: [null],
      productId: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0)]],
      subtotal: [0]
    });

    itemGroup.valueChanges.subscribe(() => {
      this.calculateItemSubtotal(itemGroup);
    });

    this.itemsArray.push(itemGroup);
  }

  removeItem(index: number) {
    this.itemsArray.removeAt(index);
  }

  onProductSelected(productId: number, index: number) {
    const product = this.products().find(p => p.id === productId);
    if (!product) return;

    const itemGroup = this.itemsArray.at(index) as FormGroup;
    itemGroup.patchValue({
      product: product,
      productId: product.id,
      unitPrice: product.price,
      quantity: 1
    });

    this.calculateItemSubtotal(itemGroup);
  }

  onProductSearch(term: string) {
    if (!term) {
      this.filteredProducts.set(this.products().slice(0, 20));
      return;
    }

    const searchTerm = term.toLowerCase();
    const filtered = this.products().filter(p =>
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

    const subtotal = (quantity * unitPrice) - discount;
    itemGroup.patchValue({ subtotal }, { emitEvent: false });
  }

  onSubmit() {
    if (this.quotationForm.invalid) {
      this.quotationForm.markAllAsTouched();
      this.error.set('Please fill all required fields');
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    const formValue = this.quotationForm.value;
    const quotationData: Quotation = {
      customerId: formValue.customerId,
      items: formValue.items,
      subtotal: this.subtotal(),
      taxAmount: this.taxAmount(),
      taxRate: formValue.taxRate,
      discount: this.discountAmount(),
      discountRate: formValue.discountRate,
      totalAmount: this.total(),
      validUntil: formValue.validUntil,
      status: formValue.status,
      notes: formValue.notes || undefined
    };

    // TODO: Implement quotation service
    console.log('Quotation data:', quotationData);

    // For now, simulate API call
    setTimeout(() => {
      this.isSaving.set(false);
      this.router.navigate(['/sales/quotations']);
    }, 1000);
  }

  onConvertToSale() {
    if (this.quotationForm.invalid) {
      this.quotationForm.markAllAsTouched();
      this.error.set('Please fill all required fields before converting');
      return;
    }

    // Navigate to sale form with pre-filled data from quotation
    const formValue = this.quotationForm.value;
    this.router.navigate(['/sales/new'], {
      state: {
        fromQuotation: true,
        quotationData: {
          customerId: formValue.customerId,
          items: formValue.items,
          taxRate: formValue.taxRate,
          discountRate: formValue.discountRate,
          notes: formValue.notes
        }
      }
    });
  }

  onCancel() {
    this.router.navigate(['/sales/quotations']);
  }
}
