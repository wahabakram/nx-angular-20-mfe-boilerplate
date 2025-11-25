import { Component } from '@angular/core';
import { SkeletonBlock, Skeleton, SkeletonLine } from '@ng-mf/components';

@Component({
  selector: 'app-dashboard-chart-widget-skeleton',
  imports: [
    SkeletonLine,
    SkeletonBlock,
    Skeleton
  ],
  templateUrl: './dashboard-chart-widget-skeleton.html',
  styleUrl: './dashboard-chart-widget-skeleton.scss'
})
export class DashboardChartWidgetSkeleton {

}
