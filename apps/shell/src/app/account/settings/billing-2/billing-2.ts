import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  createAngularTable,
  getCoreRowModel,
  getPaginationRowModel,
  ColumnDef, flexRenderComponent,
} from '@tanstack/angular-table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BillingAddress, BillingHistoryItem } from '@/account/settings/_models/billing-model';
import { BillingService } from '@/account/settings/_services/billing.service';
import { CarouselCard, Carousel } from '@ng-mf/components';
import { CountrySelect } from '@ng-mf/components';
import { BreadcrumbsStore } from '@ng-mf/components';
import { Datatable, DateCell } from '@ng-mf/components';
import { StatusCell } from '@/applications/help-center/_cells/status-cell/status-cell';
import { PlanNameCellComponent } from '@/account/settings/_cells/plan-name-cell/plan-name-cell';
import {
  BillingStatusCellComponent
} from '@/account/settings/_cells/billing-status-cell/billing-status-cell';
import {
  BillingActionsCell
} from '@/account/settings/_cells/billing-actions-cell/billing-actions-cell';
import {
  BillingCardNumberCellComponent
} from '@/account/settings/_cells/billing-card-number-cell/billing-card-number-cell';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-billing-2',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    CurrencyPipe,
    CarouselCard,
    Carousel,
    Datatable,
    CountrySelect,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
  ],
  templateUrl: './billing-2.html',
  styleUrl: './billing-2.scss'
})
export class Billing2 {
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private billingService = inject(BillingService);
  private fb = inject(FormBuilder);

  plans = this.billingService.plans;
  faqItems = this.billingService.faqItems;
  currentPlanId = signal('plan-basic');
  isAddressEditing = signal(false);

  columns = signal<ColumnDef<BillingHistoryItem>[]>([
    {
      header: 'Plan & Amount',
      accessorKey: 'planName',
      cell: () => flexRenderComponent(PlanNameCellComponent, {
        inputs: {}
      }),
    },
    {
      header: 'Date',
      accessorKey: 'date',
      cell: () => flexRenderComponent(DateCell, {
        inputs: {}
      }),
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: () => flexRenderComponent(BillingStatusCellComponent, {
        inputs: {}
      }),
    },
    {
      header: 'Card Number',
      accessorKey: 'cardLast4',
      cell: () => flexRenderComponent(BillingCardNumberCellComponent, {
        inputs: {}
      }),
    },
    {
      id: 'actions',
      header: () => '',
      size: 110,
      cell: () => flexRenderComponent(BillingActionsCell, {
        inputs: {}
      }),
    },
  ]);
  data = this.billingService.billingHistory;

  addressForm = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zipCode: ['', Validators.required],
    country: ['', Validators.required],
  });

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'account',
        name: 'Account',
        route: '/account/settings',
        type: 'link',
      },
      {
        id: 'billing',
        name: 'Billing',
        type: null
      }
    ]);

    effect(() => {
      const address = this.billingService.billingAddress();
      this.addressForm.reset(address);

      if (this.isAddressEditing()) {
        this.addressForm.enable();
      } else {
        this.addressForm.disable();
      }
    });
  }

  handlePlanUpgrade(planId: string): void {
    this.currentPlanId.set(planId);
  }

  toggleAddressEditMode(): void {
    this.isAddressEditing.update(editing => !editing);
  }

  cancelAddressEdit(): void {
    this.isAddressEditing.set(false);
  }

  saveAddressChanges(): void {
    if (this.addressForm.valid) {
      const updatedAddress = this.addressForm.getRawValue() as BillingAddress;
      this.billingService.updateBillingAddress(updatedAddress);
      this.isAddressEditing.set(false);
    }
  }

  downloadInvoice(transactionId: string): void {
    console.log('Downloading invoice for transaction:', transactionId);
  }
}
