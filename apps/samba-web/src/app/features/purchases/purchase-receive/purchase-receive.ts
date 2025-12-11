import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { PurchaseApi, Purchase, ReceivePurchaseDto, ReceivePurchaseItemDto } from '@samba/purchase-domain';
import { AuthStore } from '@samba/user-domain';
import { LedgerApi } from '@samba/ledger-domain';
import { InventoryApi } from '@samba/inventory-domain';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { BreadcrumbsStore, Panel, PanelHeader, PanelBody } from '@ng-mf/components';
import { Page } from '../../../_partials/page/page';

@Component({
  selector: 'app-purchase-receive',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButton,
    Icon,
    MatFormField,
    MatLabel,
    MatInput,
    MatDatepickerModule,
    DatePipe,
    Panel,
    PanelHeader,
    PanelBody,
    Page,
  ],
  templateUrl: './purchase-receive.html',
  styleUrl: './purchase-receive.scss'
})
export class PurchaseReceive implements OnInit {
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

  receiveForm = this.fb.group({
    deliveryDate: [new Date(), Validators.required],
    items: this.fb.array([]),
    notes: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPurchase(parseInt(id));
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
          id: 'receive',
          name: 'Receive Purchase',
          type: null,
        },
      ]);
    }
  }

  loadPurchase(id: number): void {
    this.isLoading.set(true);
    this.purchaseApi.getById(id).subscribe({
      next: (purchase) => {
        this.purchase.set(purchase);
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
    const itemsArray = this.receiveForm.get('items') as FormArray;
    purchase.items.forEach((item, index) => {
      itemsArray.push(
        this.fb.group({
          purchaseItemId: [item.id],
          productName: [item.product?.name || 'Product'],
          orderedQuantity: [item.quantity],
          receivedQuantity: [item.quantity, [Validators.required, Validators.min(0)]],
        })
      );
    });
  }

  get itemsArray(): FormArray {
    return this.receiveForm.get('items') as FormArray;
  }

  onSubmit(): void {
    if (this.receiveForm.invalid) {
      this.receiveForm.markAllAsTouched();
      return;
    }

    const user = this.authStore.user();
    if (!user) {
      this.error.set('User not authenticated');
      return;
    }

    const purchase = this.purchase();
    if (!purchase) return;

    this.isSaving.set(true);
    this.error.set(null);

    const formValue = this.receiveForm.value;
    const items: ReceivePurchaseItemDto[] = formValue.items!.map((item: any) => ({
      purchaseItemId: item.purchaseItemId,
      receivedQuantity: item.receivedQuantity,
    }));

    const receiveData: ReceivePurchaseDto = {
      purchaseId: purchase.id,
      receivedBy: user.id,
      deliveryDate: formValue.deliveryDate!,
      items: items,
      notes: formValue.notes || undefined,
    };

    this.purchaseApi.receive(receiveData).subscribe({
      next: (receivedPurchase) => {
        // Auto-adjust stock for received items
        this.adjustStockForPurchase(receivedPurchase, user.id);
      },
      error: (err) => {
        this.error.set('Failed to receive purchase order');
        this.isSaving.set(false);
      },
    });
  }

  private adjustStockForPurchase(purchase: Purchase, userId: number) {
    // Create inventory adjustments for each item received
    let completedAdjustments = 0;
    const totalItems = purchase.items.length;

    if (totalItems === 0) {
      // No items, proceed to ledger entry
      this.proceedAfterStockAdjustment(purchase, userId);
      return;
    }

    purchase.items.forEach((item) => {
      const adjustment = {
        productId: item.productId,
        branchId: purchase.branchId,
        adjustmentType: 'increase' as const,
        quantity: item.quantity,
        previousStock: 0, // Will be calculated by backend
        newStock: 0, // Will be calculated by backend
        reason: `Purchase #${purchase.id} - Received`,
        userId: userId,
      };

      this.inventoryApi.createAdjustment(adjustment).subscribe({
        next: () => {
          completedAdjustments++;
          console.log(`Stock adjusted for product ${item.productId}: +${item.quantity}`);

          // Check if all adjustments are complete
          if (completedAdjustments === totalItems) {
            this.proceedAfterStockAdjustment(purchase, userId);
          }
        },
        error: (err) => {
          console.error(`Failed to adjust stock for product ${item.productId}:`, err);
          completedAdjustments++;

          // Continue even if adjustment fails
          if (completedAdjustments === totalItems) {
            this.proceedAfterStockAdjustment(purchase, userId);
          }
        },
      });
    });
  }

  private proceedAfterStockAdjustment(purchase: Purchase, userId: number) {
    // Auto-create ledger entry for supplier
    this.createLedgerEntryForPurchase(purchase, userId);
  }

  private createLedgerEntryForPurchase(purchase: Purchase, userId: number) {
    if (!purchase.supplierId) {
      console.warn('Cannot create ledger entry: No supplier assigned to purchase');
      this.router.navigate(['/purchases', purchase.id]);
      return;
    }

    const description = `Purchase #${purchase.id} - ${purchase.invoiceNumber ? `Invoice: ${purchase.invoiceNumber}` : 'Received'}`;

    const ledgerEntry = {
      supplierId: purchase.supplierId,
      transactionType: 'PURCHASE' as const,
      transactionDate: purchase.deliveryDate || purchase.purchaseDate,
      referenceId: purchase.id,
      referenceType: 'purchase' as const,
      debit: 0,
      credit: purchase.total, // We owe supplier money
      description: description,
      branchId: purchase.branchId,
      userId: userId,
    };

    this.ledgerApi.createSupplierEntry(ledgerEntry).subscribe({
      next: () => {
        console.log('Ledger entry created for purchase:', purchase.id);
        this.router.navigate(['/purchases', purchase.id]);
      },
      error: (err) => {
        console.error('Failed to create ledger entry:', err);
        // Still navigate even if ledger entry fails
        this.router.navigate(['/purchases', purchase.id]);
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
