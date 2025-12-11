/**
 * Ledger Domain Models
 * Handles both customer ledger (accounts receivable) and supplier ledger (accounts payable)
 */

// ==================== Customer Ledger ====================

export type TransactionType = 'SALE' | 'RETURN' | 'PAYMENT' | 'CREDIT_NOTE' | 'ADJUSTMENT';
export type ReferenceType = 'sale' | 'return' | 'payment' | 'adjustment';

export interface CustomerLedgerEntry {
  id: number;
  customerId: number;
  transactionType: TransactionType;
  transactionDate: Date;
  referenceId: number; // saleId, returnId, paymentId
  referenceType: ReferenceType;
  debit: number;   // Amount customer owes (sales)
  credit: number;  // Amount customer is owed (returns, payments)
  balance: number; // Running balance
  description: string;
  branchId: number;
  userId: number; // Staff member who processed
  createdAt: Date;
}

export interface CreateCustomerLedgerEntryDto {
  customerId: number;
  transactionType: TransactionType;
  transactionDate: Date;
  referenceId: number;
  referenceType: ReferenceType;
  debit: number;
  credit: number;
  description: string;
  branchId: number;
  userId: number;
}

export interface UpdateCustomerLedgerEntryDto {
  description?: string;
  debit?: number;
  credit?: number;
}

export interface CustomerAccountSummary {
  customerId: number;
  customerName?: string;
  totalDebit: number;   // Total amount customer owes
  totalCredit: number;  // Total amount paid/credited
  currentBalance: number; // Outstanding balance
  lastTransactionDate?: Date;
  entriesCount: number;
}

export interface LedgerQueryParams {
  customerId?: number;
  transactionType?: TransactionType;
  startDate?: Date;
  endDate?: Date;
  branchId?: number;
  page?: number;
  limit?: number;
  sortBy?: 'transactionDate' | 'balance';
  sortOrder?: 'asc' | 'desc';
}

export interface LedgerResponse {
  entries: CustomerLedgerEntry[];
  total: number;
  page: number;
  limit: number;
  summary: CustomerAccountSummary;
}

// ==================== Supplier Ledger ====================

/**
 * Supplier Transaction Types
 * PURCHASE - We owe money to supplier (credit)
 * RETURN - We return items to supplier (debit)
 * PAYMENT - We pay supplier (debit)
 * CREDIT_NOTE - Supplier gives us credit (debit)
 * ADJUSTMENT - Manual correction (debit or credit)
 */
export type SupplierTransactionType = 'PURCHASE' | 'RETURN' | 'PAYMENT' | 'CREDIT_NOTE' | 'ADJUSTMENT';
export type SupplierReferenceType = 'purchase' | 'return' | 'payment' | 'adjustment';

/**
 * Supplier Ledger Entry
 * Tracks all financial transactions with suppliers (accounts payable)
 */
export interface SupplierLedgerEntry {
  id: number;
  supplierId: number;
  transactionType: SupplierTransactionType;
  transactionDate: Date;
  referenceId: number; // purchaseId, returnId, paymentId
  referenceType: SupplierReferenceType;
  debit: number;   // Amount we pay to supplier (payments, returns)
  credit: number;  // Amount we owe to supplier (purchases)
  balance: number; // Running balance (what we owe)
  description: string;
  branchId: number;
  userId: number;
  createdAt: Date;
}

/**
 * DTO for creating a supplier ledger entry
 */
export interface CreateSupplierLedgerEntryDto {
  supplierId: number;
  transactionType: SupplierTransactionType;
  transactionDate: Date;
  referenceId: number;
  referenceType: SupplierReferenceType;
  debit: number;
  credit: number;
  description: string;
  branchId: number;
  userId: number;
}

/**
 * DTO for updating a supplier ledger entry
 */
export interface UpdateSupplierLedgerEntryDto {
  description?: string;
  debit?: number;
  credit?: number;
}

/**
 * Supplier Account Summary
 * Summary of financial position with a supplier
 */
export interface SupplierAccountSummary {
  supplierId: number;
  supplierName?: string;
  totalDebit: number;   // Total paid to supplier
  totalCredit: number;  // Total owed to supplier
  currentBalance: number; // Amount we currently owe
  lastTransactionDate?: Date;
  entriesCount: number;
}

/**
 * Query parameters for filtering supplier ledger
 */
export interface SupplierLedgerQueryParams {
  supplierId?: number;
  transactionType?: SupplierTransactionType;
  startDate?: Date;
  endDate?: Date;
  branchId?: number;
  page?: number;
  limit?: number;
  sortBy?: 'transactionDate' | 'balance';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Supplier Ledger Response
 */
export interface SupplierLedgerResponse {
  entries: SupplierLedgerEntry[];
  total: number;
  page: number;
  limit: number;
  summary: SupplierAccountSummary;
}
