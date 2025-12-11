import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '@samba/infrastructure';
import { ProductStore } from '@samba/product-domain';
import {
  CreateInventoryAdjustmentDto,
  CreateStockTransferDto,
  InventoryAdjustment,
  StockTransfer,
} from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryApi {
  private apiService = inject(ApiService);
  private productStore = inject(ProductStore);
  private readonly adjustmentEndpoint = '/inventory-adjustments';
  private readonly transferEndpoint = '/stock-transfers';

  // Inventory Adjustments
  getAllAdjustments(): Observable<InventoryAdjustment[]> {
    return this.apiService.get<InventoryAdjustment[]>(this.adjustmentEndpoint);
  }

  getAdjustmentById(id: number): Observable<InventoryAdjustment> {
    return this.apiService.get<InventoryAdjustment>(`${this.adjustmentEndpoint}/${id}`);
  }

  getAdjustmentsByBranch(branchId: number): Observable<InventoryAdjustment[]> {
    return this.apiService.get<InventoryAdjustment[]>(`${this.adjustmentEndpoint}?branchId=${branchId}`);
  }

  createAdjustment(dto: CreateInventoryAdjustmentDto): Observable<InventoryAdjustment> {
    return this.apiService.post<InventoryAdjustment>(this.adjustmentEndpoint, dto).pipe(
      tap(() => {
        // Update product stock in store
        const delta = dto.adjustmentType === 'increase' || dto.adjustmentType === 'transfer-in'
          ? dto.quantity
          : -dto.quantity;
        this.productStore.updateStock(dto.productId, delta);
      })
    );
  }

  // Stock Transfers
  getAllTransfers(): Observable<StockTransfer[]> {
    return this.apiService.get<StockTransfer[]>(this.transferEndpoint);
  }

  getTransferById(id: number): Observable<StockTransfer> {
    return this.apiService.get<StockTransfer>(`${this.transferEndpoint}/${id}`);
  }

  getTransfersByBranch(branchId: number): Observable<StockTransfer[]> {
    return this.apiService.get<StockTransfer[]>(`${this.transferEndpoint}?branchId=${branchId}`);
  }

  getPendingTransfers(): Observable<StockTransfer[]> {
    return this.apiService.get<StockTransfer[]>(`${this.transferEndpoint}?status=pending`);
  }

  createTransfer(dto: CreateStockTransferDto): Observable<StockTransfer> {
    return this.apiService.post<StockTransfer>(this.transferEndpoint, dto);
  }

  approveTransfer(id: number): Observable<StockTransfer> {
    return this.apiService.post<StockTransfer>(`${this.transferEndpoint}/${id}/approve`, {});
  }

  rejectTransfer(id: number, reason: string): Observable<StockTransfer> {
    return this.apiService.post<StockTransfer>(`${this.transferEndpoint}/${id}/reject`, { reason });
  }

  markInTransit(id: number): Observable<StockTransfer> {
    return this.apiService.post<StockTransfer>(`${this.transferEndpoint}/${id}/in-transit`, {}).pipe(
      tap((transfer) => {
        // Deduct stock from source branch
        this.productStore.updateStock(transfer.productId, -transfer.quantity);
      })
    );
  }

  completeTransfer(id: number): Observable<StockTransfer> {
    return this.apiService.post<StockTransfer>(`${this.transferEndpoint}/${id}/complete`, {}).pipe(
      tap((transfer) => {
        // Add stock to destination branch
        this.productStore.updateStock(transfer.productId, transfer.quantity);
      })
    );
  }

  cancelTransfer(id: number): Observable<StockTransfer> {
    return this.apiService.post<StockTransfer>(`${this.transferEndpoint}/${id}/cancel`, {});
  }
}
