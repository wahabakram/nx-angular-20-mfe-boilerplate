import { Component, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { Icon } from '@ng-mf/components';
import { Supplier } from '@samba/supplier-domain';

@Component({
  selector: 'app-supplier-actions-cell',
  standalone: true,
  imports: [MatIconButton, Icon, MatTooltip],
  template: `
    <div class="flex gap-1">
      <button
        mat-icon-button
        (click)="onEdit()()"
        matTooltip="Edit supplier"
        class="hover:bg-blue-50 dark:hover:bg-blue-900/20"
      >
        <mf-icon
          name="solar:pen-line-duotone"
          class="text-blue-600 dark:text-blue-400"
        />
      </button>
      <button
        mat-icon-button
        (click)="onDelete()()"
        matTooltip="Delete supplier"
        class="hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <mf-icon
          name="solar:trash-bin-minimalistic-line-duotone"
          class="text-error dark:text-red-400"
        />
      </button>
    </div>
  `,
})
export class SupplierActionsCell {
  supplier = input.required<Supplier>();
  onEdit = input.required<() => void>();
  onDelete = input.required<() => void>();
}
