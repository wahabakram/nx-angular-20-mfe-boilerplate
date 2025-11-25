import { Component, signal } from '@angular/core';
import { WorkspacesSelect } from '@/components/selects';

@Component({
  selector: 'app-workspace-select-example',
  imports: [
    WorkspacesSelect
  ],
  templateUrl: './workspace-select-example.html',
  styleUrl: './workspace-select-example.scss'
})
export class WorkspaceSelectExample {
  selectedWorkspace = signal({
    id: 'slack',
    name: 'Slack',
    logoUrl: '',
    membersCount: 12
  });
  workspaces = signal([
    {
      id: 'figma',
      name: 'Figma',
      logoUrl: '',
      membersCount: 96
    },
    {
      id: 'slack',
      name: 'Slack',
      logoUrl: '',
      membersCount: 12
    }
  ]);

  onWorkspaceSelected(workspace: any) {
    this.selectedWorkspace.set(workspace);
  }
}
