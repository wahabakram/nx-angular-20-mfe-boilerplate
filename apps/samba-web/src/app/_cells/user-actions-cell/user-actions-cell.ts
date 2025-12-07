import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-actions-cell',
  imports: [MatIconButton, MatIcon],
  template: `
    <div class="flex gap-1">
      <button mat-icon-button (click)="edit()" matTooltip="Edit">
        <mat-icon>edit</mat-icon>
      </button>
      <button mat-icon-button (click)="delete()" matTooltip="Delete" class="text-error">
        <mat-icon>delete</mat-icon>
      </button>
    </div>
  `,
})
export class UserActionsCell {
  private router = inject(Router);
  
  row = input.required<any>();

  edit(): void {
    console.log('Edit user:', this.row().id);
    // Navigate to edit page when implemented
    // this.router.navigate(['/settings/users/edit', this.row().id]);
  }

  delete(): void {
    if (confirm(`Are you sure you want to delete ${this.row().username}?`)) {
      console.log('Delete user:', this.row().id);
      // Implement delete logic
    }
  }
}
