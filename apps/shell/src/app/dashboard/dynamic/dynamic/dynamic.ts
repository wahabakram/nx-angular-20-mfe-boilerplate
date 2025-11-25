import {
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  inject,
  OnDestroy,
  OnInit, PLATFORM_ID,
  signal,
  viewChild
} from '@angular/core';
import {
  KtdGridBackgroundCfg,
  KtdGridComponent,
  KtdGridLayout,
  KtdGridLayoutItem,
  KtdGridModule
} from '@katoid/angular-grid-layout';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Page } from '@/_partials/page/page';
import { debounceTime, filter, fromEvent, merge, Subscription } from 'rxjs';
import {
  PurchasesByChannelsWidget
} from '@/widgets/_widgets/purchases-by-channels-widget/purchases-by-channels-widget';
import { MatIcon } from '@angular/material/icon';
import { ConfirmManager } from '@ng-mf/components';
import { TotalTasksWidget } from '@/widgets/_widgets/total-tasks-widget/total-tasks-widget';
import { TotalProjectsWidget } from '@/widgets/_widgets/total-projects-widget/total-projects-widget';
import { Drawer, DrawerIgnoreOutsideClickDirective } from '@ng-mf/components';
import { isPlatformBrowser, isPlatformServer, NgComponentOutlet } from '@angular/common';
import {
  PurchasesByChannelSettings
} from '@/dashboard/dynamic/_settings/purchases-by-channel-settings/purchases-by-channel-settings';
import {
  TotalProjectsSettings
} from '@/dashboard/dynamic/_settings/total-projects-settings/total-projects-settings';
import {
  TotalTasksSettings
} from '@/dashboard/dynamic/_settings/total-tasks-settings/total-tasks-settings';
import { PageContentDirective } from '@/meta/page/page-content.directive';
import { WIDGET_SETTINGS_UPDATED } from '@/dashboard/dynamic/types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreadcrumbsStore } from '@ng-mf/components';

export interface DashboardItem extends KtdGridLayoutItem {
  widget: any;
  type: string;
  resizable: boolean;
  settingsComponent: any;
}

@Component({
  imports: [
    KtdGridModule,
    MatButton,
    Page,
    PurchasesByChannelsWidget,
    MatIcon,
    MatIconButton,
    TotalTasksWidget,
    TotalProjectsWidget,
    Drawer,
    NgComponentOutlet,
    DrawerIgnoreOutsideClickDirective,
    PageContentDirective
  ],
  providers: [
    {
      provide: WIDGET_SETTINGS_UPDATED,
      useValue: new EventEmitter()
    }
  ],
  templateUrl: './dynamic.html',
  styleUrl: './dynamic.scss'
})
export class Dynamic implements OnInit, OnDestroy {
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private elementRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);
  private widgetSettingsUpdated = inject<EventEmitter<any>>(WIDGET_SETTINGS_UPDATED);
  private confirmManager = inject(ConfirmManager);

  readonly grid = viewChild.required<KtdGridComponent>('grid');
  readonly layout = signal<DashboardItem[]>([
    {
      id: '0',
      x: 0,
      y: 0,
      w: 6,
      h: 6,
      resizable: false,
      type: 'purchasesByChannels',
      settingsComponent: PurchasesByChannelSettings,
      widget: {
        name: 'Purchases by channels',
      },
    },
    {
      id: '1',
      x: 6,
      y: 0,
      w: 6,
      h: 6,
      resizable: false,
      type: 'purchasesByChannels',
      settingsComponent: PurchasesByChannelSettings,
      widget: {
        name: 'Purchases by channels',
      }
    },
    {
      id: '2',
      x: 0,
      y: 3,
      w: 6,
      h: 4,
      maxH: 4,
      resizable: false,
      type: 'totalTasks',
      settingsComponent: TotalTasksSettings,
      widget: {
        name: 'Total Tasks',
      }
    },
    {
      id: '3',
      x: 6,
      y: 3,
      w: 6,
      h: 4,
      maxH: 4,
      resizable: false,
      type: 'totalProjects',
      settingsComponent: TotalProjectsSettings,
      widget: {
        name: 'Total Projects',
      }
    },
  ]);

  gridBackgroundConfig: Required<KtdGridBackgroundCfg> = {
    show: 'whenDragging',
    borderColor: 'rgba(255, 128, 0, 0.25)',
    gapColor: 'transparent',
    borderWidth: 1,
    rowColor: 'rgba(128, 128, 128, 0.10)',
    columnColor: 'rgba(128, 128, 128, 0.10)',
  };
  cols = 12;
  rowHeight = 50;
  gap = 20;
  autoResize = true;
  rowHeightFit = false;
  dragStartThreshold = 0;
  autoScroll = true;
  disableDrag = false;
  disableResize = false;
  disableRemove = false;
  preventCollision = false;
  isDragging = false;
  isResizing = false;
  showBackground = false;

  resizeSubscription!: Subscription;
  resizeObserver!: ResizeObserver;

  widgetSettingsComponent = signal<any>(null);
  activeDashboardItem = signal<DashboardItem | null>(null);

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'dynamic',
        name: 'Dynamic',
        type: null
      }
    ]);
  }

  ngOnInit() {
    this.widgetSettingsUpdated
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: any) => {
        const layout = this.layout();
        const widgetIndex = this.layout().findIndex(
          layoutItem => layoutItem.id === this.activeDashboardItem()?.id
        );
        layout[widgetIndex].widget = {
          ...layout[widgetIndex].widget,
          ...data,
        };
        this.layout.set(layout);
      });


    if (isPlatformBrowser(this.platformId)) {
      this.resizeSubscription = merge(
        fromEvent(window, 'resize'),
        fromEvent(window, 'orientationchange')
      ).pipe(
        debounceTime(50),
        filter(() => this.autoResize)
      ).subscribe(() => {
        this.grid().resize();
      });

      this.resizeObserver = new ResizeObserver(() => {
        this.grid().resize();
      });
      this.resizeObserver.observe(this.elementRef.nativeElement);
    }
  }

  ngOnDestroy() {
    this.resizeSubscription?.unsubscribe();
    this.resizeObserver?.unobserve(this.elementRef.nativeElement);
  }

  onLayoutUpdated(event: KtdGridLayout) {
    console.log('onLayoutUpdated', event);
  }

  editWidget(dashboardItem: DashboardItem, drawer: Drawer) {
    this.activeDashboardItem.set(dashboardItem);
    this.widgetSettingsComponent.set(dashboardItem.settingsComponent);

    if (drawer.isOpened) {
      return;
    }

    drawer.open();
  }

  removeWidget(dashboardItem: DashboardItem) {
    const confirmDef = this.confirmManager.open({
      title: 'Confirm widget removal',
      description: 'Are you sure to remove this widget from the dashboard?'
    });
    confirmDef.confirmed.subscribe(() => {
      this.layout.set(this.layout().filter((item: DashboardItem) => item.id !== dashboardItem.id));
    });
  }

  onWidgetSettingsClosed() {
    setTimeout(() => {
      this.activeDashboardItem.set(null);
      this.widgetSettingsComponent.set(null);
    }, 250); // wait for animation ends
  }
}
