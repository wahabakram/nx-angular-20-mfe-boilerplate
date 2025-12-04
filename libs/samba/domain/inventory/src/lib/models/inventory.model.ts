export interface InventoryAdjustment {
  id: number;
  productId: number;
  branchId: number;
  userId: number;
  adjustmentType: AdjustmentType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  notes?: string;
  synced: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AdjustmentType = 'increase' | 'decrease' | 'transfer-out' | 'transfer-in' | 'correction' | 'damage' | 'return';

export interface CreateInventoryAdjustmentDto {
  productId: number;
  branchId: number;
  userId: number;
  adjustmentType: AdjustmentType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  notes?: string;
}

export interface StockTransfer {
  id: number;
  productId: number;
  fromBranchId: number;
  toBranchId: number;
  quantity: number;
  status: StockTransferStatus;
  requestedBy: number;
  approvedBy?: number;
  notes?: string;
  requestedAt: Date;
  approvedAt?: Date;
  completedAt?: Date;
}

export type StockTransferStatus =
  | 'pending'
  | 'approved'
  | 'in-transit'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export interface CreateStockTransferDto {
  productId: number;
  fromBranchId: number;
  toBranchId: number;
  quantity: number;
  notes?: string;
}

export interface InventoryFilter {
  branchId?: number;
  productId?: number;
  adjustmentType?: AdjustmentType;
  fromDate?: Date;
  toDate?: Date;
  synced?: boolean;
}
