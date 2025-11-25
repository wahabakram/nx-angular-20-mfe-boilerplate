import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';

@Component({
  selector: 'app-subject-cell',
  imports: [],
  templateUrl: './subject-cell.html',
  styleUrl: './subject-cell.scss'
})
export class SubjectCell<T> {
  readonly context = injectFlexRenderContext<CellContext<T, any>>();

  get isRead(): boolean {
    return (this.context.row.original as any).isRead;
  }

  get text(): string {
    return (this.context.row.original as any).text;
  }
}
