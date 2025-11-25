import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from '../../../icon/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface Workspace {
  id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
}

@Component({
  selector: 'mf-sidebar',
  imports: [Icon, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private router = inject(Router);

  // Workspace management
  workspaces = signal<Workspace[]>([
    { id: 'workspace-a', name: 'Workspace A', description: 'Main workspace', isDefault: true },
    { id: 'workspace-b', name: 'Workspace B', description: 'Secondary workspace' },
    { id: 'workspace-c', name: 'Workspace C', description: 'Development workspace' },
  ]);

  selectedWorkspace = signal<Workspace | null>(
    this.workspaces().find(w => w.isDefault) || this.workspaces()[0] || null
  );

  selectWorkspace(workspace: Workspace) {
    this.selectedWorkspace.set(workspace);
    // Close the dropdown after selection by removing focus
    (document.activeElement as HTMLElement)?.blur();
    
    // Here you could also emit an event or call a service to handle workspace change
    console.log('Selected workspace:', workspace);
  }

  logout() {
    // Clear any authentication tokens/data
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    
    // Navigate to login page
    this.router.navigate(['/auth/login']);
  }
}
