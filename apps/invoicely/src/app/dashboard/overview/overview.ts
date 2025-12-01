import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard-overview',
  imports: [MatCardModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './overview.html',
  styleUrl: './overview.scss',
})
export class DashboardOverview {
  metrics = [
    {
      title: 'Total Invoices',
      value: '0',
      icon: 'receipt_long',
      color: '#667eea',
      route: '/invoices',
    },
    {
      title: 'Total Revenue',
      value: '$0',
      icon: 'attach_money',
      color: '#10b981',
      route: '/reports',
    },
    {
      title: 'Unpaid Invoices',
      value: '0',
      icon: 'pending',
      color: '#f59e0b',
      route: '/invoices',
    },
    {
      title: 'Total Clients',
      value: '0',
      icon: 'people',
      color: '#8b5cf6',
      route: '/clients',
    },
  ];
}
