import { Product } from '@samba/product-domain';

export interface Sale {
  id: number;
  branchId: number;
  userId: number;
  customerId?: number;
  items: SaleItem[];
  subtotal: number;
  tax: number;
  taxAmount: number; // Alias for tax
  taxRate: number;
  discount: number;
  discountRate: number;
  total: number;
  totalAmount: number; // Alias for total
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: SaleStatus; // Overall sale status
  amountPaid: number; // Amount customer paid
  changeDue?: number; // Change to return to customer
  notes?: string;
  receiptNumber: string;
  saleDate: Date; // Date of sale
  synced: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id: number;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: number;
}

export type PaymentMethod = 'cash' | 'card' | 'bank-transfer' | 'credit';

export type PaymentStatus = 'paid' | 'partial' | 'pending' | 'refunded';

export type SaleStatus = 'completed' | 'pending' | 'cancelled' | 'refunded';

export interface CreateSaleDto {
  branchId: number;
  userId: number;
  customerId?: number;
  items: CreateSaleItemDto[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  discountRate: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  notes?: string;
}

export interface CreateSaleItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: number;
}

export interface UpdateSaleDto extends Partial<CreateSaleDto> {
  id: number;
}

export interface SaleFilter {
  branchId?: number;
  userId?: number;
  customerId?: number;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  fromDate?: Date;
  toDate?: Date;
  synced?: boolean;
}

export interface SalesSummary {
  totalSales: number;
  totalRevenue: number;
  totalProfit: number;
  averageOrderValue: number;
  itemsSold: number;
  period: {
    from: Date;
    to: Date;
  };
}
