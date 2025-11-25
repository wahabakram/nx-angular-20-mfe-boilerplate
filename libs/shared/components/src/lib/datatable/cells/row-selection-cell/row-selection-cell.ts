import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'mf-row-selection-cell',
  imports: [
    MatCheckbox
  ],
  templateUrl: './row-selection-cell.html',
  styleUrl: './row-selection-cell.scss'
})
export class RowSelectionCell<T> {
  readonly context = injectFlexRenderContext<CellContext<T, unknown>>();
}
