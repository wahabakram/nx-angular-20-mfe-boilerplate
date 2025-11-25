import { Component, input, signal } from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { ContentEditorDataBlock } from '../../types';
import { ContentEditorCodeBlockOptions } from '../code-block/code-block';

@Component({
  selector: 'mf-divider-block',
  imports: [
    MatDivider
  ],
  templateUrl: './divider-block.html',
  styleUrl: './divider-block.scss'
})
export class DividerBlock implements ContentEditorDataBlock {
  id = input.required<string>();
  content = input.required<string>();
  options = input.required<ContentEditorCodeBlockOptions>();
  index = input.required<number>();

  readonly initialized = signal(true);

  getData(): any {
    return {
      content: null,
      options: this.options()
    };
  }

  isEmpty(): boolean {
    return true;
  }

  focus() {

  }
}
