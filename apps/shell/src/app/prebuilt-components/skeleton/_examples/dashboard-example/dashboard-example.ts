import { Component } from '@angular/core';
import { DashboardStatsWidgetSkeleton } from '@/components/skeleton';

@Component({
  selector: 'app-dashboard-example',
  imports: [DashboardStatsWidgetSkeleton],
  templateUrl: './dashboard-example.html',
  styleUrl: './dashboard-example.scss',
})
export class DashboardExample {}
