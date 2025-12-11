/**
 * Purchase Domain Models
 * Handles supplier purchase orders, receiving, and related operations
 */

import { Supplier } from '@samba/supplier-domain';
import { Product } from '@samba/product-domain';

/**
 * Purchase Status Types
 */
export type PurchaseStatus = 'draft' | 'ordered' | 'received' | 'cancelled';
export type PaymentStatus = 'pending' | 'partial' | 'paid';

/**
 * Main Purchase entity
 * Represents a purchase order from a supplier
 */
export interface Purchase {
  id: number;
  purchaseNumber: string; // PO-2024-00001
  supplierId: number;
  supplier?: Supplier;
  branchId: number;
  userId: number; // Staff who created purchase
  purchaseDate: Date;
  expectedDeliveryDate?: Date;
  deliveryDate?: Date;
  items: PurchaseItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  discount: number;
  discountRate: number;
  shippingCost: number;
  total: number;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  status: PurchaseStatus;
  invoiceNumber?: string; // Supplier's invoice number
  notes?: string;
  createdBy?: string;
  receivedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Purchase Item
 * Individual product line in a purchase order
 */
export interface PurchaseItem {
  id?: number;
  purchaseId?: number;
  productId: number;
  product?: Product;
  quantity: number;
  receivedQuantity?: number; // For partial deliveries
  unitCost: number; // Cost price from supplier
  discount: number;
  subtotal: number;
}

/**
 * DTO for creating a new purchase
 */
export interface CreatePurchaseDto {
  supplierId: number;
  branchId: number;
  userId: number;
  purchaseDate: Date;
  expectedDeliveryDate?: Date;
  items: CreatePurchaseItemDto[];
  taxRate: number;
  discountRate: number;
  shippingCost?: number;
  invoiceNumber?: string;
  notes?: string;
}

/**
 * DTO for creating a purchase item
 */
export interface CreatePurchaseItemDto {
  productId: number;
  quantity: number;
  unitCost: number;
  discount?: number;
}

/**
 * DTO for updating a purchase
 */
export interface UpdatePurchaseDto {
  supplierId?: number;
  expectedDeliveryDate?: Date;
  taxRate?: number;
  discountRate?: number;
  shippingCost?: number;
  invoiceNumber?: string;
  notes?: string;
  status?: PurchaseStatus;
  paymentStatus?: PaymentStatus;
}

/**
 * DTO for receiving a purchase
 */
export interface ReceivePurchaseDto {
  purchaseId: number;
  receivedBy: number; // User ID
  deliveryDate: Date;
  items: ReceivePurchaseItemDto[];
  notes?: string;
}

/**
 * DTO for receiving individual items
 */
export interface ReceivePurchaseItemDto {
  purchaseItemId: number;
  receivedQuantity: number;
}

/**
 * Query parameters for filtering purchases
 */
export interface PurchaseQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'purchaseDate' | 'total' | 'status' | 'purchaseNumber';
  sortOrder?: 'asc' | 'desc';
  status?: PurchaseStatus;
  paymentStatus?: PaymentStatus;
  supplierId?: number;
  branchId?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

/**
 * Purchase summary statistics
 */
export interface PurchaseSummary {
  totalPurchases: number;
  totalAmount: number;
  pendingOrders: number;
  receivedOrders: number;
  totalByStatus: {
    draft: number;
    ordered: number;
    received: number;
    cancelled: number;
  };
  totalByPaymentStatus: {
    pending: number;
    partial: number;
    paid: number;
  };
}

/**
 * Purchase Return Types
 */
export type PurchaseReturnStatus = 'pending' | 'processed' | 'cancelled';
export type RefundMethod = 'cash' | 'bank-transfer' | 'credit-note' | 'adjustment';
export type ReturnReason = 'defective' | 'wrong-item' | 'damaged' | 'excess' | 'other';

/**
 * Purchase Return entity
 * Represents items returned to supplier
 */
export interface PurchaseReturn {
  id: number;
  returnNumber: string; // PR-2024-00001
  purchaseId: number;
  purchase?: Purchase;
  supplierId: number;
  supplier?: Supplier;
  branchId: number;
  userId: number;
  returnDate: Date;
  items: PurchaseReturnItem[];
  subtotal: number;
  tax: number;
  total: number;
  refundMethod: RefundMethod;
  refundAmount: number;
  status: PurchaseReturnStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Purchase Return Item
 * Individual product line in a purchase return
 */
export interface PurchaseReturnItem {
  id?: number;
  returnId?: number;
  purchaseItemId: number;
  productId: number;
  product?: Product;
  quantity: number;
  unitCost: number;
  subtotal: number;
  reason: ReturnReason;
}

/**
 * DTO for creating a purchase return
 */
export interface CreatePurchaseReturnDto {
  purchaseId: number;
  supplierId: number;
  branchId: number;
  userId: number;
  returnDate: Date;
  items: CreatePurchaseReturnItemDto[];
  refundMethod: RefundMethod;
  notes?: string;
}

/**
 * DTO for creating a purchase return item
 */
export interface CreatePurchaseReturnItemDto {
  purchaseItemId: number;
  productId: number;
  quantity: number;
  unitCost: number;
  reason: ReturnReason;
}

/**
 * Query parameters for filtering purchase returns
 */
export interface PurchaseReturnQueryParams {
  page?: number;
  limit?: number;
  sortBy?: 'returnDate' | 'total' | 'status' | 'returnNumber';
  sortOrder?: 'asc' | 'desc';
  status?: PurchaseReturnStatus;
  supplierId?: number;
  branchId?: number;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}
