export interface Client {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  taxId?: string;
  address?: ClientAddress;
  tags?: Tag[];
  notes?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ClientAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
}

export interface ClientStatistics {
  total: number;
  active: number;
  inactive: number;
  totalRevenue: number;
  totalInvoices: number;
}

export interface CreateClientRequest {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  website?: string;
  taxId?: string;
  address?: ClientAddress;
  tags?: number[];
  notes?: string;
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {
  status?: 'active' | 'inactive';
}
