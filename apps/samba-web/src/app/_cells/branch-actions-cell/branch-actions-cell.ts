import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';

@Component({
  selector: 'app-branch-actions-cell',
  imports: [MatIconButton, Icon],
  template: `
    <div class="flex gap-1">
      <button mat-icon-button (click)="edit()" matTooltip="Edit">
        <mf-icon
          name="solar:pen-line-duotone"
          class="text-blue-600 dark:text-blue-400"
        />
      </button>
      <button
        mat-icon-button
        (click)="delete()"
        matTooltip="Delete"
        class="text-error"
      >
        <mf-icon
          name="solar:trash-bin-minimalistic-line-duotone"
          class="text-error dark:text-red-400"
        />
      </button>
    </div>
  `,
})
export class BranchActionsCell {
  private router = inject(Router);

  row = input.required<any>();

  edit(): void {
    console.log('Edit branch:', this.row().id);
    // Navigate to edit page when implemented
    // this.router.navigate(['/settings/branches/edit', this.row().id]);
  }

  delete(): void {
    if (confirm(`Are you sure you want to delete ${this.row().name}?`)) {
      console.log('Delete branch:', this.row().id);
      // Implement delete logic
    }
  }
}
