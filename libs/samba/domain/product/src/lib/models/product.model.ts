export interface Product {
  id: number;
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  costPrice: number;
  categoryId: number;
  supplierId?: number;
  status: ProductStatus;
  stockLevel: number;
  lowStockThreshold: number;
  reorderPoint: number;
  maxStockLevel: number;
  unit: string; // 'piece', 'box', 'kg', etc.
  description?: string;
  imageUrl?: string;
  branchId: number; // Multi-branch support
  createdAt: Date;
  updatedAt: Date;
}

export type ProductStatus = 'active' | 'inactive' | 'discontinued';

export interface CreateProductDto {
  name: string;
  sku: string;
  barcode?: string;
  price: number;
  costPrice: number;
  categoryId: number;
  supplierId?: number;
  status: ProductStatus;
  stockLevel: number;
  lowStockThreshold: number;
  reorderPoint: number;
  maxStockLevel: number;
  unit: string;
  description?: string;
  imageUrl?: string;
  branchId: number;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {
  id: number;
}

export interface ProductFilter {
  search?: string;
  categoryId?: number;
  status?: ProductStatus;
  branchId?: number;
  lowStock?: boolean;
}
