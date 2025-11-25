import { Component } from '@angular/core';
import { CellContext, injectFlexRenderContext } from '@tanstack/angular-table';
import { MatIcon } from '@angular/material/icon';
import { FileItem } from '@/applications/file-manager/types';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-star-cell',
  imports: [
    MatIcon,
    MatIconButton
  ],
  templateUrl: './star-cell.html',
  styleUrl: './star-cell.scss'
})
export class StarCell<T> {
  readonly context = injectFlexRenderContext<CellContext<T, unknown>>();

  get row(): any {
    return this.context.row
  }

  protected isStarred = this.context.getValue();

  toggleStar(file: FileItem): void {
    this.isStarred = !this.isStarred;
  }
}
