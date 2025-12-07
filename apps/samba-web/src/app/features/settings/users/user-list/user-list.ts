import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Datatable, Panel, PanelHeader, PanelBody } from '@ng-mf/components';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { UserActionsCell } from '../../../../_cells/user-actions-cell/user-actions-cell';
import { UserStatusCell } from '../../../../_cells/user-status-cell/user-status-cell';

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'manager' | 'cashier';
  branchId: number;
  isActive: boolean;
  createdAt: string;
}

@Component({
  selector: 'app-user-list',
  imports: [Datatable, Panel, PanelHeader, PanelBody, MatButton, MatIcon],
  templateUrl: './user-list.html',
  styleUrl: './user-list.scss'
})
export class UserList implements OnInit {
  private router = inject(Router);

  users = signal<User[]>([]);
  isLoading = signal(false);

  columns = signal<ColumnDef<User>[]>([
    {
      header: 'Name',
      accessorKey: 'firstName',
      size: 200,
      cell: (info) => {
        const user = info.row.original;
        return `${user.firstName} ${user.lastName}`;
      },
    },
    {
      header: 'Username',
      accessorKey: 'username',
      size: 150,
    },
    {
      header: 'Email',
      accessorKey: 'email',
      size: 200,
    },
    {
      header: 'Role',
      accessorKey: 'role',
      size: 120,
      cell: (info) => {
        const role = info.getValue() as string;
        const colorMap: Record<string, string> = {
          admin: 'bg-error/10 text-error',
          manager: 'bg-primary/10 text-primary',
          cashier: 'bg-success/10 text-success'
        };
        const color = colorMap[role] || 'bg-neutral/10 text-neutral';
        return `<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium ${color}">${role}</span>`;
      },
    },
    {
      header: 'Branch',
      accessorKey: 'branchId',
      size: 120,
      cell: (info) => `Branch #${info.getValue()}`,
    },
    {
      header: 'Status',
      accessorKey: 'isActive',
      size: 100,
      cell: (info) => {
        return flexRenderComponent(UserStatusCell, {
          inputs: {
            isActive: info.getValue() as boolean,
          },
        });
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      accessorKey: 'id',
      size: 120,
      enableSorting: false,
      meta: {
        pinned: 'right'
      },
      cell: (info) => {
        return flexRenderComponent(UserActionsCell, {
          inputs: {
            row: info.row.original,
          },
        });
      },
    },
  ]);

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    // Mock data for now
    setTimeout(() => {
      this.users.set([
        {
          id: 1,
          username: 'admin',
          email: 'admin@samba.com',
          firstName: 'System',
          lastName: 'Administrator',
          role: 'admin',
          branchId: 1,
          isActive: true,
          createdAt: '2025-01-01'
        },
        {
          id: 2,
          username: 'manager1',
          email: 'manager@samba.com',
          firstName: 'John',
          lastName: 'Manager',
          role: 'manager',
          branchId: 1,
          isActive: true,
          createdAt: '2025-01-05'
        },
        {
          id: 3,
          username: 'cashier1',
          email: 'cashier@samba.com',
          firstName: 'Jane',
          lastName: 'Cashier',
          role: 'cashier',
          branchId: 1,
          isActive: true,
          createdAt: '2025-01-10'
        }
      ]);
      this.isLoading.set(false);
    }, 500);
  }

  onTableInteraction(event: any): void {
    const target = event.target as HTMLElement;
    const editBtn = target.closest('.edit-btn');
    const deleteBtn = target.closest('.delete-btn');

    if (editBtn) {
      const id = editBtn.getAttribute('data-id');
      if (id) {
        this.editUser(parseInt(id));
      }
    } else if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-id');
      if (id) {
        this.deleteUser(parseInt(id));
      }
    }
  }

  createUser(): void {
    this.router.navigate(['/settings/users/new']);
  }

  editUser(id: number): void {
    this.router.navigate(['/settings/users/edit', id]);
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      // Delete logic here
      this.users.update(users => users.filter(u => u.id !== id));
    }
  }
}
