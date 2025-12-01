export interface Invoice {
  id: number;
  invoiceNumber: string;
  clientId: number;
  client?: Client;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  discountType: 'percentage' | 'fixed';
  total: number;
  notes?: string;
  terms?: string;
  currencyId: number;
  currency?: Currency;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id?: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceStatistics {
  total: number;
  draft: number;
  sent: number;
  paid: number;
  overdue: number;
  cancelled: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
}

export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface Currency {
  id: number;
  code: string;
  symbol: string;
  name: string;
}

export interface CreateInvoiceRequest {
  clientId: number;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  tax: number;
  discount: number;
  notes?: string;
  terms?: string;
  currencyId: number;
}

export interface UpdateInvoiceRequest extends Partial<CreateInvoiceRequest> {
  status?: InvoiceStatus;
}
