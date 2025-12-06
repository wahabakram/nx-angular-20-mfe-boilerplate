import { Component, input } from '@angular/core';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-status-cell',
  imports: [MatChip],
  template: `
    <mat-chip
      [class.bg-success-50]="row() === 'active'"
      [class.text-success]="row() === 'active'"
      [class.bg-neutral-100]="row() === 'inactive'"
      [class.bg-error-50]="row() === 'discontinued'"
      [class.text-error]="row() === 'discontinued'">
      {{ row() }}
    </mat-chip>
  `,
})
export class StatusCell {
  row = input.required<string>();
}
