import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  selector: 'app-priority-cell',
  imports: [],
  templateUrl: './priority-cell.html',
  styleUrl: './priority-cell.scss'
})
export class PriorityCell<T> {
  readonly context = injectFlexRenderContext<CellContext<T, any>>()

  get row() {
    return this.context.row
  }
}
