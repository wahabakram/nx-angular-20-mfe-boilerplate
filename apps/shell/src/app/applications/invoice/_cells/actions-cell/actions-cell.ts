import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-actions-cell',
  imports: [
    MatIconButton,
    MatIcon,
    RouterLink
  ],
  templateUrl: './actions-cell.html',
  styleUrl: './actions-cell.scss'
})
export class ActionsCell<T> {
  readonly context = injectFlexRenderContext<CellContext<T, any>>();

  get row() {
    return this.context.row
  }

  protected delete() {

  }
}
