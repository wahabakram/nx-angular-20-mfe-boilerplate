import { Product } from '@samba/product-domain';
import { Customer } from '@samba/customer-domain';
import { Sale } from '@samba/sale-domain';

/**
 * Return reasons enumeration
 */
export type ReturnReason = 'defective' | 'wrong-item' | 'changed-mind' | 'damaged' | 'other';

/**
 * Refund methods enumeration
 */
export type RefundMethod = 'cash' | 'card' | 'credit-note' | 'exchange';

/**
 * Return status enumeration
 */
export type ReturnStatus = 'pending' | 'processed' | 'cancelled';

/**
 * Return entity - represents a product return from a customer
 */
export interface Return {
  id: number;
  returnNumber: string; // RET-2024-00001
  saleId: number;
  sale?: Sale;
  customerId: number;
  customer?: Customer;
  branchId: number;
  userId: number; // Staff processing return
  returnDate: Date;
  items: ReturnItem[];
  subtotal: number;
  tax: number;
  total: number;
  refundMethod: RefundMethod;
  refundAmount: number;
  status: ReturnStatus;
  notes?: string;
  processedBy?: string; // User name
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Return item - individual product being returned
 */
export interface ReturnItem {
  id?: number;
  returnId?: number;
  saleItemId: number;
  productId: number;
  product?: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  reason: ReturnReason;
}

/**
 * DTO for creating a return
 */
export interface CreateReturnDto {
  saleId: number;
  customerId?: number; // Optional for walk-in customers
  branchId: number;
  userId: number;
  items: CreateReturnItemDto[];
  refundMethod: RefundMethod;
  notes?: string;
}

/**
 * DTO for creating a return item
 */
export interface CreateReturnItemDto {
  saleItemId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  reason: ReturnReason;
}

/**
 * DTO for updating a return
 */
export interface UpdateReturnDto {
  id: number;
  items?: CreateReturnItemDto[];
  refundMethod?: RefundMethod;
  status?: ReturnStatus;
  notes?: string;
}

/**
 * Query parameters for filtering returns
 */
export interface ReturnQueryParams {
  startDate?: string;
  endDate?: string;
  customerId?: number;
  branchId?: number;
  status?: ReturnStatus;
  refundMethod?: RefundMethod;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Return summary statistics
 */
export interface ReturnSummary {
  totalReturns: number;
  totalRefundAmount: number;
  returnRate: number; // Percentage of sales returned
  byReason: Record<ReturnReason, number>;
  byStatus: Record<ReturnStatus, number>;
  topReturnedProducts: Array<{
    productId: number;
    productName: string;
    returnCount: number;
    returnAmount: number;
  }>;
}
