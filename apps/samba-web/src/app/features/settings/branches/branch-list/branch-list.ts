import { Component, OnInit, inject, signal, viewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Datatable, Panel, PanelHeader, PanelBody, BreadcrumbsStore } from '@ng-mf/components';
import { ColumnDef, flexRenderComponent } from '@tanstack/angular-table';
import { MatButton } from '@angular/material/button';
import { Icon } from '@ng-mf/components';
import { BranchActionsCell } from '../../../../_cells/branch-actions-cell/branch-actions-cell';
import { BranchStatusCell } from '../../../../_cells/branch-status-cell/branch-status-cell';

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
  imports: [Datatable, Panel, PanelHeader, PanelBody, MatButton, Icon, RouterLink],
  templateUrl: './branch-list.html',
  styleUrl: './branch-list.scss'
})
export class BranchList implements OnInit {
  private router = inject(Router);
  private breadcrumbsStore = inject(BreadcrumbsStore);

  datatable = viewChild<Datatable<Branch>>('dt');
  branches = signal<Branch[]>([]);
  isLoading = signal(false);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'settings',
        name: 'Settings',
        route: '/settings',
        type: 'link',
      },
      {
        id: 'branches',
        name: 'Branches',
        type: null,
      },
    ]);
  }

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
        return flexRenderComponent(BranchStatusCell, {
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
        return flexRenderComponent(BranchActionsCell, {
          inputs: {
            row: info.row.original,
          },
        });
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

  onSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const dt = this.datatable();
    if (dt) {
      dt.setGlobalFilter(value);
    }
  }
}
