import { Component } from '@angular/core';
import {
  SkeletonBlock,
  Skeleton,
  SkeletonLine,
} from '../../../data-display/skeleton';

@Component({
  selector: 'mfc-widget-skeleton',
  exportAs: 'mfcWidgetSkeleton',
  imports: [SkeletonLine, SkeletonBlock, Skeleton],
  templateUrl: './widget-skeleton.html',
  styleUrl: './widget-skeleton.scss',
  host: {
    class: 'mfc-widget-skeleton',
  },
})
export class WidgetSkeleton {}
