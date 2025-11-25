import { Component } from '@angular/core';
import { SkeletonBlock, Skeleton, SkeletonLine } from '@ng-mf/components';

@Component({
  selector: 'app-dashboard-stats-widget-skeleton',
  imports: [
    SkeletonBlock,
    SkeletonLine,
    Skeleton
  ],
  templateUrl: './dashboard-stats-widget-skeleton.html',
  styleUrl: './dashboard-stats-widget-skeleton.scss'
})
export class DashboardStatsWidgetSkeleton {

}
