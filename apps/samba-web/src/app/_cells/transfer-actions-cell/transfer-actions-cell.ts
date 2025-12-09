import { Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

interface StockTransfer {
  id: number;
  status: 'pending' | 'approved' | 'in-transit' | 'completed' | 'rejected';
}

@Component({
  selector: 'app-transfer-actions-cell',
  standalone: true,
  imports: [MatIconButton, MatIcon, MatTooltip],
  template: `
    <div class="flex gap-1">
      <button
        mat-icon-button
        (click)="onView.emit(row().id)"
        matTooltip="View details"
        class="hover:bg-blue-50 dark:hover:bg-blue-900/20"
      >
        <mat-icon class="text-blue-600 dark:text-blue-400">visibility</mat-icon>
      </button>
      @if (row().status === 'pending') {
        <button
          mat-icon-button
          (click)="onApprove.emit(row().id)"
          matTooltip="Approve transfer"
          class="hover:bg-green-50 dark:hover:bg-green-900/20"
        >
          <mat-icon class="text-green-600 dark:text-green-400">check_circle</mat-icon>
        </button>
        <button
          mat-icon-button
          (click)="onReject.emit(row().id)"
          matTooltip="Reject transfer"
          class="hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <mat-icon class="text-red-600 dark:text-red-400">cancel</mat-icon>
        </button>
      }
    </div>
  `,
})
export class TransferActionsCell {
  row = input.required<StockTransfer>();
  onView = output<number>();
  onApprove = output<number>();
  onReject = output<number>();
}
