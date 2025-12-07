import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-category-actions-cell',
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
export class CategoryActionsCell {
  private router = inject(Router);
  
  row = input.required<any>();

  edit(): void {
    console.log('Edit category:', this.row().id);
    // Navigate to edit page when implemented
    // this.router.navigate(['/settings/categories/edit', this.row().id]);
  }

  delete(): void {
    if (confirm(`Are you sure you want to delete ${this.row().name}?`)) {
      console.log('Delete category:', this.row().id);
      // Implement delete logic
    }
  }
}
