import { booleanAttribute, Component, input } from '@angular/core';

@Component({
  selector: 'mf-sidebar',
  exportAs: 'mfSidebar',
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  host: {
    'class': 'mf-sidebar',
    '[class.compact]': 'compact()',
    '[class.compact-hover]': '_compactHover',
    '(mouseenter)': 'mouseenter()',
    '(mouseleave)': 'mouseleave()'
  }
})
export class Sidebar {
  compact = input(false, {
    transform: booleanAttribute
  });
  protected _compactHover = false;

  get api() {
    return {
      isCompact: () => this.compact() || this._compactHover,
    }
  }

  protected mouseenter() {
    this._compactHover = true;
  }

  protected mouseleave() {
    this._compactHover = false;
  }
}
