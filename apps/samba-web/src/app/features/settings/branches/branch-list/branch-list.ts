import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Datatable } from '@ng-mf/components';
import { ColumnDef } from '@tanstack/angular-table';
import { Page } from '../../../../_partials/page/page';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

interface Branch {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  isMainBranch: boolean;
  isActive: boolean;
}

@Component({
  selector: 'app-branch-list',
  imports: [Datatable, Page, MatButton, MatIcon],
  templateUrl: './branch-list.html',
  styleUrl: './branch-list.scss'
})
export class BranchList implements OnInit {
  private router = inject(Router);

  branches = signal<Branch[]>([]);
  isLoading = signal(false);

  columns = signal<ColumnDef<Branch>[]>([
    {
      header: 'Name',
      accessorKey: 'name',
      size: 200,
    },
    {
      header: 'Code',
      accessorKey: 'code',
      size: 100,
    },
    {
      header: 'City',
      accessorKey: 'city',
      size: 150,
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      size: 150,
    },
    {
      header: 'Email',
      accessorKey: 'email',
      size: 200,
    },
    {
      header: 'Type',
      accessorKey: 'isMainBranch',
      size: 120,
      cell: (info) => {
        const isMain = info.getValue() as boolean;
        return isMain
          ? '<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">Main Branch</span>'
          : '<span class="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-neutral/10 text-neutral">Branch</span>';
      },
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
          </div>
        `;
      },
    },
  ]);

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.isLoading.set(true);
    // Mock data
    setTimeout(() => {
      this.branches.set([
        {
          id: 1,
          name: 'Main Branch - HQ',
          code: 'MAIN',
          address: '123 Main Street',
          city: 'Karachi',
          phone: '+92-21-1234567',
          email: 'main@samba.com',
          isMainBranch: true,
          isActive: true
        },
        {
          id: 2,
          name: 'North Branch',
          code: 'NORTH',
          address: '456 North Avenue',
          city: 'Lahore',
          phone: '+92-42-1234567',
          email: 'north@samba.com',
          isMainBranch: false,
          isActive: true
        },
        {
          id: 3,
          name: 'South Branch',
          code: 'SOUTH',
          address: '789 South Road',
          city: 'Islamabad',
          phone: '+92-51-1234567',
          email: 'south@samba.com',
          isMainBranch: false,
          isActive: true
        }
      ]);
      this.isLoading.set(false);
    }, 500);
  }

  onTableInteraction(event: any): void {
    const target = event.target as HTMLElement;
    const editBtn = target.closest('.edit-btn');

    if (editBtn) {
      const id = editBtn.getAttribute('data-id');
      if (id) {
        this.editBranch(parseInt(id));
      }
    }
  }

  createBranch(): void {
    this.router.navigate(['/settings/branches/new']);
  }

  editBranch(id: number): void {
    this.router.navigate(['/settings/branches/edit', id]);
  }
}
