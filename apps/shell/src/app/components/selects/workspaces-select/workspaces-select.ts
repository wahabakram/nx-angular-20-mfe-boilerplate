import { Component, effect, input, output, signal } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatRipple } from '@angular/material/core';
import { Dicebear } from '@ng-mf/components';
import { HorizontalDivider } from '@ng-mf/components';

@Component({
  selector: 'app-workspaces-select',
  imports: [
    MatMenu,
    MatMenuTrigger,
    MatIcon,
    Dicebear,
    HorizontalDivider,
    MatButton,
    MatRipple
  ],
  templateUrl: './workspaces-select.html',
  styleUrl: './workspaces-select.scss'
})
export class WorkspacesSelect {
  workspaces = input<any[]>([]);
  selectedWorkspace = input();
  protected _selectedWorkspace = signal<any>(null);

  readonly workspaceSelected = output<any>();

  constructor() {
    effect(() => {
      this._selectedWorkspace.set(this.selectedWorkspace());
    });
  }

  selectWorkspace(workspace: any) {
    if (this._selectedWorkspace()?.id === workspace.id) {
      return;
    }

    this._selectedWorkspace.set(workspace);
    this.workspaceSelected.emit(workspace);
  }
}
