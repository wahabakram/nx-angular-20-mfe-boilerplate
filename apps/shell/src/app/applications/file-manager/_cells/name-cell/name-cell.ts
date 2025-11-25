import { Component, OnInit } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-name-cell',
  imports: [
    MatIcon
  ],
  templateUrl: './name-cell.html',
  styleUrl: './name-cell.scss'
})
export class NameCell<T> implements OnInit {
  readonly context = injectFlexRenderContext<CellContext<T, unknown>>()

  get row(): any {
    return this.context.row
  }

  ngOnInit() {
  }
}
