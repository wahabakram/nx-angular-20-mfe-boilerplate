import { Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { Icon } from '@ng-mf/components';

interface StockTransfer {
  id: number;
  status: 'pending' | 'approved' | 'in-transit' | 'completed' | 'rejected';
}

@Component({
  selector: 'app-transfer-actions-cell',
  standalone: true,
  imports: [MatIconButton, Icon, MatTooltip],
  template: `
    <div class="flex gap-1">
      <button
        mat-icon-button
        (click)="onView.emit(row().id)"
        matTooltip="View details"
        class="hover:bg-blue-50 dark:hover:bg-blue-900/20"
      >
        <mf-icon name="solar:eye-line-duotone" />
      </button>
      @if (row().status === 'pending') {
      <button
        mat-icon-button
        (click)="onApprove.emit(row().id)"
        matTooltip="Approve transfer"
        class="hover:bg-green-50 dark:hover:bg-green-900/20"
      >
        <mf-icon
          name="solar:check-circle-line-duotone"
          class="text-green-600 dark:text-green-400"
        />
      </button>
      <button
        mat-icon-button
        (click)="onReject.emit(row().id)"
        matTooltip="Reject transfer"
        class="hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <mf-icon
          name="solar:close-circle-line-duotone"
          class="text-error dark:text-red-400"
        />
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
