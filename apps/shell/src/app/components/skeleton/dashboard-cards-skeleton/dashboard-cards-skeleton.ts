import { Component, input, numberAttribute } from '@angular/core';
import { SkeletonBlock, Skeleton, SkeletonLine } from '@ng-mf/components';

@Component({
  selector: 'app-dashboard-cards-skeleton',
  imports: [
    SkeletonBlock,
    SkeletonLine,
    Skeleton
  ],
  templateUrl: './dashboard-cards-skeleton.html',
  styleUrl: './dashboard-cards-skeleton.scss'
})
export class DashboardCardsSkeleton {
  count = input(2, {
    transform: numberAttribute
  });
}
