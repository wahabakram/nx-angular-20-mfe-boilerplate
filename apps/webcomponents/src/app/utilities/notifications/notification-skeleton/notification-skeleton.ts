import { Component } from '@angular/core';
import {
  SkeletonBlock,
  SkeletonCircle,
  Skeleton,
  SkeletonLine
} from '../../../data-display/skeleton';

@Component({
  selector: 'mfc-notification-skeleton',
  exportAs: 'mfcNotificationSkeleton',
  imports: [
    Skeleton,
    SkeletonCircle,
    SkeletonLine,
    SkeletonBlock
  ],
  templateUrl: './notification-skeleton.html',
  styleUrl: './notification-skeleton.scss',
  host: {
    'class': 'mfc-notification-skeleton',
  }
})
export class NotificationSkeleton {

}
