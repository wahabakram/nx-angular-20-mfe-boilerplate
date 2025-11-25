import { Component, inject, signal } from '@angular/core';
import { Page } from '@/_partials/page/page';
import { MatIcon } from '@angular/material/icon';
import { Datatable } from '@ng-mf/components';
import { MatButton } from '@angular/material/button';
import { flexRenderComponent } from '@tanstack/angular-table';
import { ObjectCell } from '@/datatables/_cells/object-cell/object-cell';
import { CurrencyCell } from '@/datatables/_cells/currency-cell/currency-cell';
import { StatusCell } from '@/applications/invoice/_cells/status-cell/status-cell';
import { ActionsCell } from '@/applications/invoice/_cells/actions-cell/actions-cell';
import { RouterLink } from '@angular/router';
import { BreadcrumbsStore } from '@ng-mf/components';

@Component({
  selector: 'app-invoices',
  imports: [
    Page,
    MatIcon,
    Datatable,
    MatButton,
    RouterLink
  ],
  templateUrl: './invoices.html',
  styleUrl: './invoices.scss'
})
export class Invoices {
  private breadcrumbsStore = inject(BreadcrumbsStore);

  readonly columns = signal([
    {
      header: 'Invoice ID',
      accessorKey: 'id',
      size: 150
    },
    {
      header: 'Bill from',
      accessorKey: 'billFrom',
      cell: () => {
        return flexRenderComponent(ObjectCell, {
          inputs: {}
        })
      },
    },
    {
      header: 'Bill to',
      accessorKey: 'billTo',
      cell: () => {
        return flexRenderComponent(ObjectCell, {
          inputs: {}
        })
      },
    },
    {
      header: 'Total cost',
      accessorKey: 'totalCost',
      cell: () => {
        return flexRenderComponent(CurrencyCell, {
          inputs: {}
        })
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: () => {
        return flexRenderComponent(StatusCell, {
          inputs: {}
        })
      },
    },
    {
      header: '',
      accessorKey: 'id',
      size: 100,
      cell: () => {
        return flexRenderComponent(ActionsCell, {
          inputs: {}
        })
      },
    }
  ]);
  readonly data = signal([
    {
      "id": "RT3080",
      "billFrom": {
        "id": "FR001",
        "name": "Innovatech Solutions"
      },
      "billTo": {
        "id": "TO001",
        "name": "Quantum Dynamics"
      },
      "totalCost": 1800.90,
      "status": {
        "name": "Paid",
        "type": "paid"
      }
    },
    {
      "id": "XM9141",
      "billFrom": {
        "id": "FR002",
        "name": "Apex Global"
      },
      "billTo": {
        "id": "TO002",
        "name": "Stellar Systems"
      },
      "totalCost": 556.00,
      "status": {
        "name": "Pending",
        "type": "pending"
      }
    },
    {
      "id": "RG0314",
      "billFrom": {
        "id": "FR003",
        "name": "Vertex Corp"
      },
      "billTo": {
        "id": "TO003",
        "name": "Pinnacle Enterprises"
      },
      "totalCost": 14002.33,
      "status": {
        "name": "Issued",
        "type": "issued"
      }
    },
    {
      "id": "AA1449",
      "billFrom": {
        "id": "FR004",
        "name": "Fusion LLC"
      },
      "billTo": {
        "id": "TO004",
        "name": "NextGen Industries"
      },
      "totalCost": 102.04,
      "status": {
        "name": "Draft",
        "type": "draft"
      }
    },
    {
      "id": "FV2353",
      "billFrom": {
        "id": "FR005",
        "name": "Orion Group"
      },
      "billTo": {
        "id": "TO005",
        "name": "Synergy Partners"
      },
      "totalCost": 3150.00,
      "status": {
        "name": "Issued",
        "type": "issued"
      }
    },
    {
      "id": "AB8421",
      "billFrom": {
        "id": "FR006",
        "name": "Titan Holdings"
      },
      "billTo": {
        "id": "TO006",
        "name": "Momentum Co."
      },
      "totalCost": 789.50,
      "status": {
        "name": "Pending",
        "type": "pending"
      }
    },
    {
      "id": "TY5678",
      "billFrom": {
        "id": "FR007",
        "name": "Zenith Innovations"
      },
      "billTo": {
        "id": "TO007",
        "name": "Evolve Ltd."
      },
      "totalCost": 4200.75,
      "status": {
        "name": "Paid",
        "type": "paid"
      }
    },
    {
      "id": "FG2001",
      "billFrom": {
        "id": "FR008",
        "name": "Nova Solutions"
      },
      "billTo": {
        "id": "TO008",
        "name": "BrightMinds Inc."
      },
      "totalCost": 99.99,
      "status": {
        "name": "Pending",
        "type": "pending"
      }
    },
    {
      "id": "QW3321",
      "billFrom": {
        "id": "FR009",
        "name": "Summit Tech"
      },
      "billTo": {
        "id": "TO009",
        "name": "Catalyst Creations"
      },
      "totalCost": 2500.00,
      "status": {
        "name": "Paid",
        "type": "paid"
      }
    },
    {
      "id": "UZ1010",
      "billFrom": {
        "id": "FR010",
        "name": "Horizon Digital"
      },
      "billTo": {
        "id": "TO010",
        "name": "Anchor Systems"
      },
      "totalCost": 850.20,
      "status": {
        "name": "Draft",
        "type": "draft"
      }
    },
    {
      "id": "LP6543",
      "billFrom": {
        "id": "FR011",
        "name": "Keystone Co."
      },
      "billTo": {
        "id": "TO011",
        "name": "Vanguard Group"
      },
      "totalCost": 1105.60,
      "status": {
        "name": "Pending",
        "type": "pending"
      }
    }
  ]);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'new',
        name: 'Invoices',
        type: null
      }
    ]);
  }
}
