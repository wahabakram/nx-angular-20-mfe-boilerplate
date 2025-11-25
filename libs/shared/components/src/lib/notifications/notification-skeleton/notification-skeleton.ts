import { Component } from '@angular/core';
import {
  SkeletonBlock,
  SkeletonCircle,
  Skeleton,
  SkeletonLine
} from '../../skeleton';

@Component({
  selector: 'mf-notification-skeleton',
  exportAs: 'mfNotificationSkeleton',
  imports: [
    Skeleton,
    SkeletonCircle,
    SkeletonLine,
    SkeletonBlock
  ],
  templateUrl: './notification-skeleton.html',
  styleUrl: './notification-skeleton.scss',
  host: {
    'class': 'mf-notification-skeleton',
  }
})
export class NotificationSkeleton {

}
