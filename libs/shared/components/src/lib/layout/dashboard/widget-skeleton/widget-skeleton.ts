import { Component } from '@angular/core';
import {
  SkeletonBlock,
  Skeleton,
  SkeletonLine,
} from '../../../skeleton';

@Component({
  selector: 'mf-widget-skeleton',
  exportAs: 'mfWidgetSkeleton',
  imports: [SkeletonLine, SkeletonBlock, Skeleton],
  templateUrl: './widget-skeleton.html',
  styleUrl: './widget-skeleton.scss',
  host: {
    class: 'mf-widget-skeleton',
  },
})
export class WidgetSkeleton {}
