import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { PurchaseApi, Purchase, CreatePurchaseReturnDto, CreatePurchaseReturnItemDto, RefundMethod, ReturnReason } from '@samba/purchase-domain';
import { AuthStore } from '@samba/user-domain';
import { LedgerApi } from '@samba/ledger-domain';
import { InventoryApi } from '@samba/inventory-domain';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckbox } from '@angular/material/checkbox';
import { DatePipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { BreadcrumbsStore } from '@ng-mf/components';
import { Page } from '../../../_partials/page/page';

interface ReturnFormItem {
  purchaseItemId: number;
  productId: number;
  productName: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitCost: number;
  selected: boolean;
  returnQuantity: number;
  reason: ReturnReason;
  subtotal: number;
}

@Component({
  selector: 'app-purchase-return-form',
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
    MatDatepickerModule,
    MatCheckbox,
    DatePipe,
    CurrencyPipe,
    TitleCasePipe,
    Page,
  ],
  templateUrl: './purchase-return-form.html',
  styleUrl: './purchase-return-form.scss'
})
export class PurchaseReturnForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private purchaseApi = inject(PurchaseApi);
  private authStore = inject(AuthStore);
  private ledgerApi = inject(LedgerApi);
  private inventoryApi = inject(InventoryApi);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  purchase = signal<Purchase | null>(null);
  isLoading = signal(false);
  isSaving = signal(false);
  error = signal<string | null>(null);

  refundMethods: RefundMethod[] = ['cash', 'bank-transfer', 'credit-note', 'adjustment'];
  returnReasons: ReturnReason[] = ['defective', 'wrong-item', 'damaged', 'excess', 'other'];

  returnForm = this.fb.group({
    purchaseId: [0, Validators.required],
    returnDate: [new Date(), Validators.required],
    refundMethod: ['bank-transfer' as RefundMethod, Validators.required],
    items: this.fb.array([]),
    notes: [''],
  });

  ngOnInit(): void {
    const purchaseId = this.route.snapshot.paramMap.get('purchaseId');
    if (purchaseId) {
      this.loadPurchase(parseInt(purchaseId));
      this.breadcrumbsStore.setBreadcrumbs([
        {
          id: 'home',
          name: 'Home',
          route: '/',
          type: 'link',
        },
        {
          id: 'purchases',
          name: 'Purchases',
          route: '/purchases',
          type: 'link',
        },
        {
          id: 'return',
          name: 'Purchase Return',
          type: null,
        },
      ]);
    }
  }

  loadPurchase(id: number): void {
    this.isLoading.set(true);
    this.purchaseApi.getById(id).subscribe({
      next: (purchase) => {
        if (purchase.status !== 'received') {
          this.error.set('Only received purchases can be returned');
          this.isLoading.set(false);
          return;
        }

        this.purchase.set(purchase);
        this.returnForm.patchValue({ purchaseId: purchase.id });
        this.populateItems(purchase);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load purchase order');
        this.isLoading.set(false);
      }
    });
  }

  populateItems(purchase: Purchase): void {
    const itemsArray = this.returnForm.get('items') as FormArray;
    purchase.items.forEach((item) => {
      const receivedQty = item.receivedQuantity || item.quantity;

      itemsArray.push(
        this.fb.group({
          purchaseItemId: [item.id],
          productId: [item.productId],
          productName: [item.product?.name || 'Product'],
          orderedQuantity: [item.quantity],
          receivedQuantity: [receivedQty],
          unitCost: [item.unitCost],
          selected: [false],
          returnQuantity: [0, [Validators.required, Validators.min(1), Validators.max(receivedQty)]],
          reason: ['defective' as ReturnReason, Validators.required],
          subtotal: [0],
        })
      );
    });
  }

  get itemsArray(): FormArray {
    return this.returnForm.get('items') as FormArray;
  }

  onItemSelectionChange(index: number): void {
    const item = this.itemsArray.at(index);
    const selected = item.get('selected')?.value;
    const receivedQty = item.get('receivedQuantity')?.value;

    if (selected && item.get('returnQuantity')?.value === 0) {
      // Set default return quantity to received quantity when selected
      item.patchValue({ returnQuantity: receivedQty });
    }

    this.updateItemSubtotal(index);
  }

  onReturnQuantityChange(index: number): void {
    this.updateItemSubtotal(index);
  }

  updateItemSubtotal(index: number): void {
    const item = this.itemsArray.at(index);
    const selected = item.get('selected')?.value;
    const returnQuantity = item.get('returnQuantity')?.value || 0;
    const unitCost = item.get('unitCost')?.value || 0;

    const subtotal = selected ? returnQuantity * unitCost : 0;
    item.patchValue({ subtotal }, { emitEvent: false });
  }

  subtotal = computed(() => {
    const items = (this.returnForm?.get('items')?.value as ReturnFormItem[]) || [];
    return items.reduce(
      (sum: number, item: ReturnFormItem) => sum + (item.selected ? item.subtotal : 0), 0
    );
  });

  tax = computed(() => {
    const purchase = this.purchase();
    if (!purchase) return 0;
    return this.subtotal() * purchase.taxRate;
  });

  total = computed(() => {
    return this.subtotal() + this.tax();
  });

  selectedItemsCount = computed(() => {
    const items = (this.returnForm?.get('items')?.value as ReturnFormItem[]) || [];
    return items.filter((item: ReturnFormItem) => item.selected).length;
  });

  onSubmit(): void {
    if (this.returnForm.invalid) {
      this.returnForm.markAllAsTouched();
      return;
    }

    const user = this.authStore.user();
    if (!user) {
      this.error.set('User not authenticated');
      return;
    }

    const purchase = this.purchase();
    if (!purchase) return;

    const formValue = this.returnForm.value;
    const items = (formValue.items as ReturnFormItem[]) || [];
    const selectedItems = items.filter((item: ReturnFormItem) => item.selected);

    if (selectedItems.length === 0) {
      this.error.set('Please select at least one item to return');
      return;
    }

    this.isSaving.set(true);
    this.error.set(null);

    const returnItems: CreatePurchaseReturnItemDto[] = selectedItems.map((item: ReturnFormItem) => ({
      purchaseItemId: item.purchaseItemId,
      productId: item.productId,
      quantity: item.returnQuantity,
      unitCost: item.unitCost,
      reason: item.reason,
    }));

    const returnData: CreatePurchaseReturnDto = {
      purchaseId: purchase.id,
      supplierId: purchase.supplierId,
      branchId: purchase.branchId,
      userId: user.id,
      returnDate: formValue.returnDate!,
      items: returnItems,
      refundMethod: formValue.refundMethod!,
      notes: formValue.notes || undefined,
    };

    this.purchaseApi.createReturn(returnData).subscribe({
      next: (purchaseReturn) => {
        // Auto-adjust stock for returned items
        const purchase = this.purchase();
        if (purchase && user) {
          this.adjustStockForPurchaseReturn(purchaseReturn, purchase, user.id);
        } else {
          this.router.navigate(['/purchases/returns']);
        }
      },
      error: (err) => {
        this.error.set('Failed to create purchase return');
        this.isSaving.set(false);
      },
    });
  }

  private adjustStockForPurchaseReturn(purchaseReturn: any, purchase: Purchase, userId: number) {
    // Create inventory adjustments for each item returned to supplier
    let completedAdjustments = 0;
    const totalItems = purchaseReturn.items.length;

    if (totalItems === 0) {
      // No items, proceed to ledger entry
      this.proceedAfterStockAdjustment(purchaseReturn, purchase, userId);
      return;
    }

    purchaseReturn.items.forEach((item: any) => {
      const adjustment = {
        productId: item.productId,
        branchId: purchase.branchId,
        adjustmentType: 'decrease' as const,
        quantity: item.quantity,
        previousStock: 0, // Will be calculated by backend
        newStock: 0, // Will be calculated by backend
        reason: `Purchase Return #${purchaseReturn.id} - ${item.reason}`,
        userId: userId,
      };

      this.inventoryApi.createAdjustment(adjustment).subscribe({
        next: () => {
          completedAdjustments++;
          console.log(`Stock adjusted for product ${item.productId}: -${item.quantity}`);

          // Check if all adjustments are complete
          if (completedAdjustments === totalItems) {
            this.proceedAfterStockAdjustment(purchaseReturn, purchase, userId);
          }
        },
        error: (err) => {
          console.error(`Failed to adjust stock for product ${item.productId}:`, err);
          completedAdjustments++;

          // Continue even if adjustment fails
          if (completedAdjustments === totalItems) {
            this.proceedAfterStockAdjustment(purchaseReturn, purchase, userId);
          }
        },
      });
    });
  }

  private proceedAfterStockAdjustment(purchaseReturn: any, purchase: Purchase, userId: number) {
    // Auto-create ledger entry for supplier
    if (purchase.supplierId) {
      this.createLedgerEntryForPurchaseReturn(purchaseReturn, purchase, userId);
    } else {
      this.router.navigate(['/purchases/returns']);
    }
  }

  private createLedgerEntryForPurchaseReturn(purchaseReturn: any, purchase: Purchase, userId: number) {
    if (!purchase.supplierId) {
      console.warn('Cannot create ledger entry: No supplier assigned to purchase');
      this.router.navigate(['/purchases/returns']);
      return;
    }

    const description = `Purchase Return #${purchaseReturn.id} - ${purchase.invoiceNumber ? `Invoice: ${purchase.invoiceNumber}` : ''} Original Purchase #${purchase.id}`;

    const ledgerEntry = {
      supplierId: purchase.supplierId,
      transactionType: 'RETURN' as const,
      transactionDate: purchaseReturn.returnDate,
      referenceId: purchaseReturn.id,
      referenceType: 'return' as const,
      debit: purchaseReturn.total, // Our debt to supplier is reduced
      credit: 0,
      description: description,
      branchId: purchase.branchId,
      userId: userId,
    };

    this.ledgerApi.createSupplierEntry(ledgerEntry).subscribe({
      next: () => {
        console.log('Ledger entry created for purchase return:', purchaseReturn.id);
        this.router.navigate(['/purchases/returns']);
      },
      error: (err) => {
        console.error('Failed to create ledger entry:', err);
        // Still navigate even if ledger entry fails
        this.router.navigate(['/purchases/returns']);
      },
    });
  }

  cancel(): void {
    const purchase = this.purchase();
    if (purchase) {
      this.router.navigate(['/purchases', purchase.id]);
    } else {
      this.router.navigate(['/purchases']);
    }
  }
}
