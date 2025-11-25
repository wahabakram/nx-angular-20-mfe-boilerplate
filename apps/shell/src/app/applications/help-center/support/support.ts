import { Component, signal } from '@angular/core';
import {
  ColumnDef, flexRenderComponent,
} from '@tanstack/angular-table';
import { Ticket } from '@/applications/help-center/ticket.model';
import { Datatable } from '@ng-mf/components';
import { PanelBody, Panel, PanelHeader } from '@ng-mf/components';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { PriorityCell } from '@/applications/help-center/_cells/priority-cell/priority-cell';
import { StatusCell } from '@/applications/help-center/_cells/status-cell/status-cell';
import { Container } from '@/_partials/container/container';

const defaultColumns: ColumnDef<Ticket>[] = [
  {
    header: 'Subject',
    accessorKey: 'subject',
    size: 300
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: () => flexRenderComponent(StatusCell, {
      inputs: {}
    })
  },
  { header: 'Submission date', accessorKey: 'submissionDate' },
  { header: 'Ticket ID', accessorKey: 'ticketId' },
  {
    header: 'Priority',
    accessorKey: 'priority',
    cell: () => flexRenderComponent(PriorityCell, {
      inputs: {}
    })
  },
];
const defaultData: Ticket[] = [
  {
    subject: 'React native gesture handler error',
    status: {
      name: 'Open',
      type: 'open'
    },
    submissionDate: '11/25/2024',
    ticketId: '#535664',
    priority: {
      type: 'high',
      name: 'High'
    },
  },
  {
    subject: 'Access group not working prop...',
    status: {
      type: 'inProgress',
      name: 'In progress'
    },
    submissionDate: '11/24/2024',
    ticketId: '#546467',
    priority: {
      type: 'medium',
      name: 'Medium'
    },
  },
  {
    subject: 'SSO login not working',
    status: {
      type: 'closed',
      name: 'Closed'
    },
    submissionDate: '11/12/2024',
    ticketId: '#754322',
    priority: {
      type: 'low',
      name: 'Low'
    },
  },
];

@Component({
  imports: [
    Datatable,
    Panel,
    PanelBody,
    PanelHeader,
    MatButton,
    MatIcon,
    Container
  ],
  templateUrl: './support.html',
  styleUrl: './support.scss'
})
export class Support {
  data = signal<Ticket[]>(defaultData)
  columns = signal<ColumnDef<Ticket>[]>(defaultColumns);
}
