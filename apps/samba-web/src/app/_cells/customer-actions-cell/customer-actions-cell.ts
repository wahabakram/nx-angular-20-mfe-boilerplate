import { Component, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Customer } from '@samba/customer-domain';

@Component({
  selector: 'app-customer-actions-cell',
  standalone: true,
  imports: [MatIconButton, MatIcon, MatTooltip],
  template: `
    <div class="flex gap-1">
      <button
        mat-icon-button
        (click)="onEdit()()"
        matTooltip="Edit customer"
        class="hover:bg-blue-50 dark:hover:bg-blue-900/20"
      >
        <mat-icon class="text-blue-600 dark:text-blue-400">edit</mat-icon>
      </button>
      <button
        mat-icon-button
        (click)="onDelete()()"
        matTooltip="Delete customer"
        class="hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <mat-icon class="text-red-600 dark:text-red-400">delete</mat-icon>
      </button>
    </div>
  `,
})
export class CustomerActionsCell {
  customer = input.required<Customer>();
  onEdit = input.required<() => void>();
  onDelete = input.required<() => void>();
}
