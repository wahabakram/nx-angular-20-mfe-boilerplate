export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  taxId?: string;
  customerType: CustomerType;
  creditLimit?: number;
  currentBalance: number;
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CustomerType = 'retail' | 'wholesale' | 'vip';

export interface CreateCustomerDto {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  taxId?: string;
  customerType: CustomerType;
  creditLimit?: number;
  notes?: string;
  isActive: boolean;
}

export interface UpdateCustomerDto extends Partial<CreateCustomerDto> {
  id: number;
}

export interface CustomerFilter {
  search?: string;
  customerType?: CustomerType;
  isActive?: boolean;
  hasBalance?: boolean;
}
