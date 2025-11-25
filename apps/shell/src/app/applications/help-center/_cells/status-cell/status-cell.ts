import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  selector: 'app-status-cell',
  imports: [],
  templateUrl: './status-cell.html',
  styleUrl: './status-cell.scss'
})
export class StatusCell<T> {
  readonly context = injectFlexRenderContext<CellContext<T, any>>()

  get row() {
    return this.context.row;
  }
}
