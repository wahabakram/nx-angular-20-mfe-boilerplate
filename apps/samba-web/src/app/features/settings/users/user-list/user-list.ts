import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Datatable } from '@ng-mf/components';
import { ColumnDef } from '@tanstack/angular-table';
import { Page } from '../../../../_partials/page/page';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

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
  imports: [Datatable, Page, MatButton, MatIcon],
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
        const isActive = info.getValue() as boolean;
        return isActive
          ? '<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success">Active</span>'
          : '<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-neutral/10 text-neutral">Inactive</span>';
      },
    },
    {
      header: 'Actions',
      accessorKey: 'id',
      size: 150,
      cell: (info) => {
        return `
          <div class="flex gap-2">
            <button class="edit-btn p-1 rounded hover:bg-surface-container" data-id="${info.getValue()}" title="Edit">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </button>
            <button class="delete-btn p-1 rounded hover:bg-surface-container text-error" data-id="${info.getValue()}" title="Delete">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        `;
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
