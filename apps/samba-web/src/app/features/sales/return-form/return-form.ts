import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { BreadcrumbsStore } from '@ng-mf/components';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCheckbox } from '@angular/material/checkbox';
import { DecimalPipe, DatePipe } from '@angular/common';
import { Product } from '@samba/product-domain';
import { Sale, SaleItem, SaleApi } from '@samba/sale-domain';
import {
  CreateReturnDto,
  CreateReturnItemDto,
  ReturnApi,
  ReturnStore,
  ReturnReason,
  RefundMethod,
} from '@samba/return-domain';
import { AuthStore } from '@samba/user-domain';
import { LedgerApi } from '@samba/ledger-domain';
import { InventoryApi } from '@samba/inventory-domain';
import { Page } from '../../../_partials/page/page';

interface ReturnFormItem {
  saleItem: SaleItem;
  selected: boolean;
  returnQuantity: number;
  maxQuantity: number;
  reason: ReturnReason | '';
  subtotal: number;
}

@Component({
  selector: 'app-return-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatButton,
    MatIconButton,
    Icon,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatSelect,
    MatOption,
    MatProgressSpinner,
    MatTooltip,
    MatCheckbox,
    Page,
    DecimalPipe,
    DatePipe,
  ],
  templateUrl: './return-form.html',
  styleUrl: './return-form.scss',
})
export class ReturnForm implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authStore = inject(AuthStore);
  private saleApi = inject(SaleApi);
  private returnApi = inject(ReturnApi);
  private returnStore = inject(ReturnStore);
  private ledgerApi = inject(LedgerApi);
  private inventoryApi = inject(InventoryApi);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  returnForm!: FormGroup;
  selectedSale = signal<Sale | null>(null);
  returnItems = signal<ReturnFormItem[]>([]);

  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);

  returnReasons: { value: ReturnReason; label: string }[] = [
    { value: 'defective', label: 'Defective Product' },
    { value: 'wrong-item', label: 'Wrong Item' },
    { value: 'changed-mind', label: 'Customer Changed Mind' },
    { value: 'damaged', label: 'Damaged Product' },
    { value: 'other', label: 'Other' },
  ];

  refundMethods: { value: RefundMethod; label: string }[] = [
    { value: 'cash', label: 'Cash Refund' },
    { value: 'card', label: 'Card Refund' },
    { value: 'credit-note', label: 'Store Credit' },
    { value: 'exchange', label: 'Exchange' },
  ];

  // Computed values
  selectedItems = computed(() => {
    return this.returnItems().filter((item) => item.selected);
  });

  totalRefundAmount = computed(() => {
    return this.selectedItems().reduce((sum, item) => sum + item.subtotal, 0);
  });

  ngOnInit() {
    this.breadcrumbsStore.setBreadcrumbs([
      { id: 'home', name: 'Home', route: '/', type: 'link' },
      { id: 'sales', name: 'Sales', route: '/sales', type: 'link' },
      { id: 'returns', name: 'Returns', route: '/sales/returns', type: 'link' },
      { id: 'new-return', name: 'New Return', type: null },
    ]);

    this.returnForm = this.fb.group({
      saleNumber: ['', Validators.required],
      refundMethod: ['cash', Validators.required],
      notes: [''],
    });
  }

  searchSale() {
    const saleNumber = this.returnForm.get('saleNumber')?.value;
    if (!saleNumber) {
      this.error.set('Please enter a sale number');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);

    // For now, we'll use a simple getAll and filter approach
    // In production, you'd have an API endpoint to search by sale number
    this.saleApi.getAll().subscribe({
      next: (sales) => {
        const sale = sales.find((s) => s.receiptNumber === saleNumber);
        if (sale) {
          this.loadSaleForReturn(sale);
        } else {
          this.error.set(`Sale ${saleNumber} not found`);
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error('Error searching sale:', err);
        this.error.set('Failed to search sale. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  private loadSaleForReturn(sale: Sale) {
    // Get returnable items for this sale
    this.saleApi.getById(sale.id).subscribe({
      next: (fullSale) => {
        this.selectedSale.set(fullSale);

        // Create return form items from sale items
        const items: ReturnFormItem[] = (fullSale.items || []).map((saleItem) => ({
          saleItem,
          selected: false,
          returnQuantity: 0,
          maxQuantity: saleItem.quantity,
          reason: '',
          subtotal: 0,
        }));

        this.returnItems.set(items);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading sale:', err);
        this.error.set('Failed to load sale details');
        this.isLoading.set(false);
      },
    });
  }

  toggleItemSelection(index: number) {
    const items = [...this.returnItems()];
    items[index].selected = !items[index].selected;

    // If selecting, set return quantity to max
    if (items[index].selected) {
      items[index].returnQuantity = items[index].maxQuantity;
      this.updateItemSubtotal(items, index);
    } else {
      items[index].returnQuantity = 0;
      items[index].subtotal = 0;
      items[index].reason = '';
    }

    this.returnItems.set(items);
  }

  onQuantityChange(index: number) {
    const items = [...this.returnItems()];
    const quantity = items[index].returnQuantity;

    // Validate quantity
    if (quantity > items[index].maxQuantity) {
      items[index].returnQuantity = items[index].maxQuantity;
    } else if (quantity < 0) {
      items[index].returnQuantity = 0;
    }

    this.updateItemSubtotal(items, index);
    this.returnItems.set(items);
  }

  onReasonChange(index: number, event: Event) {
    const items = [...this.returnItems()];
    const reason = (event.target as HTMLSelectElement).value as ReturnReason;
    items[index].reason = reason;
    this.returnItems.set(items);
  }

  private updateItemSubtotal(items: ReturnFormItem[], index: number) {
    const item = items[index];
    item.subtotal = item.returnQuantity * item.saleItem.unitPrice;
  }

  onSubmit() {
    if (!this.selectedSale()) {
      this.error.set('Please select a sale first');
      return;
    }

    const selectedItems = this.selectedItems();
    if (selectedItems.length === 0) {
      this.error.set('Please select at least one item to return');
      return;
    }

    // Validate all selected items have reasons
    const missingReason = selectedItems.find((item) => !item.reason);
    if (missingReason) {
      this.error.set('Please provide a return reason for all selected items');
      return;
    }

    if (!this.returnForm.valid) {
      this.error.set('Please fill in all required fields');
      return;
    }

    const currentUser = this.authStore.user();
    const sale = this.selectedSale()!;

    const returnItems: CreateReturnItemDto[] = selectedItems.map((item) => ({
      saleItemId: item.saleItem.id!,
      productId: item.saleItem.productId,
      quantity: item.returnQuantity,
      unitPrice: item.saleItem.unitPrice,
      reason: item.reason as ReturnReason,
    }));

    const returnDto: CreateReturnDto = {
      saleId: sale.id,
      customerId: sale.customerId,
      branchId: sale.branchId,
      userId: currentUser?.id || 0,
      items: returnItems,
      refundMethod: this.returnForm.value.refundMethod,
      notes: this.returnForm.value.notes || undefined,
    };

    this.isSaving.set(true);
    this.error.set(null);

    this.returnApi.create(returnDto).subscribe({
      next: (createdReturn) => {
        this.returnStore.addReturn(createdReturn);

        // Auto-adjust stock for returned items
        if (currentUser) {
          this.adjustStockForReturn(createdReturn, currentUser.id);
        } else {
          this.isSaving.set(false);
          this.router.navigate(['/sales/returns']);
        }
      },
      error: (err) => {
        console.error('Error creating return:', err);
        this.error.set('Failed to process return. Please try again.');
        this.isSaving.set(false);
      },
    });
  }

  private adjustStockForReturn(returnData: any, userId: number) {
    // Create inventory adjustments for each item returned
    let completedAdjustments = 0;
    const totalItems = returnData.items.length;

    if (totalItems === 0) {
      // No items, proceed to ledger entry
      this.proceedAfterStockAdjustment(returnData, userId);
      return;
    }

    returnData.items.forEach((item: any) => {
      const adjustment = {
        productId: item.productId,
        branchId: returnData.branchId,
        adjustmentType: 'return' as const,
        quantity: item.quantity,
        previousStock: 0, // Will be calculated by backend
        newStock: 0, // Will be calculated by backend
        reason: `Return #${returnData.id} - ${item.reason}`,
        userId: userId,
      };

      this.inventoryApi.createAdjustment(adjustment).subscribe({
        next: () => {
          completedAdjustments++;
          console.log(`Stock adjusted for product ${item.productId}: +${item.quantity}`);

          // Check if all adjustments are complete
          if (completedAdjustments === totalItems) {
            this.proceedAfterStockAdjustment(returnData, userId);
          }
        },
        error: (err) => {
          console.error(`Failed to adjust stock for product ${item.productId}:`, err);
          completedAdjustments++;

          // Continue even if adjustment fails
          if (completedAdjustments === totalItems) {
            this.proceedAfterStockAdjustment(returnData, userId);
          }
        },
      });
    });
  }

  private proceedAfterStockAdjustment(returnData: any, userId: number) {
    // Auto-create ledger entry if customer is assigned
    if (returnData.customerId) {
      this.createLedgerEntryForReturn(returnData, userId);
    } else {
      this.isSaving.set(false);
      this.router.navigate(['/sales/returns']);
    }
  }

  private createLedgerEntryForReturn(returnData: any, userId: number) {
    if (!returnData.customerId) {
      console.warn('Cannot create ledger entry: No customer assigned to return');
      this.isSaving.set(false);
      this.router.navigate(['/sales/returns']);
      return;
    }

    const description = `Return #${returnData.id} - ${this.getRefundMethodLabel(returnData.refundMethod)} - Original Sale #${returnData.saleId}`;

    const ledgerEntry = {
      customerId: returnData.customerId,
      transactionType: 'RETURN' as const,
      transactionDate: returnData.returnDate,
      referenceId: returnData.id,
      referenceType: 'return' as const,
      debit: 0,
      credit: returnData.total, // Customer is credited (debt reduced)
      description: description,
      branchId: returnData.branchId,
      userId: userId,
    };

    this.ledgerApi.createEntry(ledgerEntry).subscribe({
      next: () => {
        console.log('Ledger entry created for return:', returnData.id);
        this.isSaving.set(false);
        this.router.navigate(['/sales/returns']);
      },
      error: (err) => {
        console.error('Failed to create ledger entry:', err);
        // Still navigate even if ledger entry fails
        this.isSaving.set(false);
        this.router.navigate(['/sales/returns']);
      },
    });
  }

  private getRefundMethodLabel(method: RefundMethod): string {
    const found = this.refundMethods.find((m) => m.value === method);
    return found?.label || method;
  }

  cancel() {
    this.router.navigate(['/sales/returns']);
  }

  clearSale() {
    this.selectedSale.set(null);
    this.returnItems.set([]);
    this.returnForm.patchValue({ saleNumber: '' });
    this.error.set(null);
  }
}
