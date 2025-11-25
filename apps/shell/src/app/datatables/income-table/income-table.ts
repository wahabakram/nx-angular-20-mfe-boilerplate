import { Component, signal } from '@angular/core';
import {
  Datatable,
} from '@ng-mf/components';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { UserCell } from '@/datatables/_cells/user-cell/user-cell';
import { CurrencyCell } from '@/datatables/_cells/currency-cell/currency-cell';
import { PaymentCell } from '@/datatables/_cells/payment-cell/payment-cell';
import { PaymentStatusCell } from '@/datatables/_cells/payment-status-cell/payment-status-cell';
import { DateCell } from '@/datatables/_cells/date-cell/date-cell';

export type PaymentMethod = 'visa' | 'mastercard' | 'paypal' | string;
export type PaymentStatusType = 'success' | 'pending' | 'failed' | string;

export interface Transaction {
  user: {
    avatarUrl: string;
    name: string;
    relationship: string;
  };
  payment: {
    method: PaymentMethod;
    last4?: string;
    email?: string;
    icon: string;
  };
  amount: number;
  status: {
    name: string;
    type: PaymentStatusType
  };
  date: string;
}

@Component({
  selector: 'app-income-table',
  imports: [
    Datatable
  ],
  templateUrl: './income-table.html',
  styleUrl: './income-table.scss'
})
export class IncomeTable {
  columns = signal<ColumnDef<Transaction>[]>([
    {
      id: 'user',
      accessorKey: 'user',
      header: 'User',
      cell: () => {
        return flexRenderComponent(UserCell, {
          inputs: {}
        })
      },
    },
    {
      id: 'payment',
      accessorKey: 'payment',
      header: 'Payment Info',
      cell: () => {
        return flexRenderComponent(PaymentCell, {
          inputs: {}
        })
      },
    },
    {
      id: 'amount',
      accessorKey: 'amount',
      header: 'Amount',
      size: 100,
      cell: () => {
        return flexRenderComponent(CurrencyCell, {
          inputs: {}
        })
      },
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      size: 120,
      cell: () => {
        return flexRenderComponent(PaymentStatusCell, {
          inputs: {}
        })
      },
    },
    {
      id: 'date',
      accessorKey: 'date',
      header: 'Date',
      size: 100,
      cell: () => {
        return flexRenderComponent(DateCell, {
          inputs: {}
        })
      },
    }
  ]);
  data = signal<Transaction[]>([
    {
      user: {
        avatarUrl: 'assets/avatars/1.svg',
        name: 'Alicia Vik',
        relationship: 'Friend'
      },
      payment: {
        method: 'visa',
        last4: '2345',
        icon: 'path/to/visa-logo.svg'
      },
      amount: 1415.95,
      status: {
        name: 'Pending',
        type: 'pending'
      },
      date: 'June 12, 22'
    },
    {
      user: {
        avatarUrl: 'assets/avatars/2.svg',
        name: 'Brad Pitt',
        relationship: 'Colleagues'
      },
      payment: {
        method: 'mastercard',
        last4: '7654',
        icon: 'path/to/mastercard-logo.svg'
      },
      amount: 300.16,
      status: {
        name: 'Success',
        type: 'success'
      },
      date: 'June 12, 22'
    },
    {
      user: {
        avatarUrl: 'assets/avatars/3.svg',
        name: 'Elizabeth',
        relationship: 'Family'
      },
      payment: {
        method: 'paypal',
        email: 'e******g@****.com',
        icon: 'path/to/paypal-logo.svg'
      },
      amount: 45.40,
      status: {
        name: 'Failed',
        type: 'failed'
      },
      date: 'June 12, 22'
    }
  ]);
}
