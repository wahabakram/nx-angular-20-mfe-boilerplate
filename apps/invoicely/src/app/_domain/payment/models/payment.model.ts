export interface Payment {
  id: number;
  invoiceId: number;
  invoice?: Invoice;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export type PaymentMethod =
  | 'cash'
  | 'bank_transfer'
  | 'credit_card'
  | 'debit_card'
  | 'paypal'
  | 'check'
  | 'other';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Invoice {
  id: number;
  invoiceNumber: string;
  clientName?: string;
  total: number;
}

export interface PaymentStatistics {
  total: number;
  pending: number;
  completed: number;
  failed: number;
  refunded: number;
  totalAmount: number;
  completedAmount: number;
  pendingAmount: number;
}

export interface CreatePaymentRequest {
  invoiceId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: PaymentMethod;
  referenceNumber?: string;
  notes?: string;
}

export interface UpdatePaymentRequest extends Partial<CreatePaymentRequest> {
  status?: PaymentStatus;
}
