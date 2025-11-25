import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  selector: 'app-from-cell',
  imports: [],
  templateUrl: './from-cell.html',
  styleUrl: './from-cell.scss'
})
export class FromCell<T> {
  readonly context = injectFlexRenderContext<CellContext<T, any>>();

  get isRead(): boolean {
    return (this.context.row.original as any).isRead;
  }
}
