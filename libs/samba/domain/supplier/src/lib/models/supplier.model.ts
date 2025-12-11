/**
 * Supplier Domain Models
 */

export type SupplierStatus = 'active' | 'inactive' | 'blocked';

export interface Supplier {
  id: number;
  name: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string; // NTN, GSTIN, etc.
  paymentTerms?: string; // "Net 30", "Net 60", "COD", etc.
  creditLimit?: number;
  currentBalance: number; // Amount we owe
  notes?: string;
  status: SupplierStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSupplierDto {
  name: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  creditLimit?: number;
  notes?: string;
  status?: SupplierStatus;
}

export interface UpdateSupplierDto {
  name?: string;
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  country?: string;
  taxId?: string;
  paymentTerms?: string;
  creditLimit?: number;
  notes?: string;
  status?: SupplierStatus;
}

export interface SupplierQueryParams {
  status?: SupplierStatus;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'currentBalance' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface SupplierSummary {
  totalSuppliers: number;
  activeSuppliers: number;
  inactiveSuppliers: number;
  blockedSuppliers: number;
  totalPayables: number;
}
