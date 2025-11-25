import { BreadcrumbsStore } from '@ng-mf/components';

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed, ElementRef,
  inject, OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { ScheduleDataService } from '../schedule-data.service';
import { CalendarEvent, Category, FullCalendarEvent } from '../types';
import { MatButton, MatIconButton } from '@angular/material/button';
import dayGridPlugin from '@fullcalendar/daygrid';
import {
  PanelBody,
  Panel,
  PanelHeader, PanelSidebar
} from '@ng-mf/components';
import { OverlayScrollbar } from '@ng-mf/components';
import { Container } from '@/_partials/container/container';
import { SegmentedButton, Segmented } from '@ng-mf/components';
import { VerticalDivider } from '@ng-mf/components';
import {
  Navigation,
  NavigationItemBadgeDirective,
  NavigationItem
} from '@ng-mf/components';
import { filter } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  EventFormDialog
} from '@/applications/calendar/_dialogs/event-form-dialog/event-form-dialog';

type CalendarView = 'timeGridDay' | 'timeGridWeek' | 'dayGridMonth' | 'dayGridYear';

@Component({
  selector: 'app-calendar',
  imports: [
    DatePipe,
    FullCalendarModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonToggleModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconButton,
    Panel,
    OverlayScrollbar,
    PanelBody,
    PanelHeader,
    PanelSidebar,
    Container,
    Segmented,
    SegmentedButton,
    MatButton,
    VerticalDivider,
    Navigation,
    NavigationItem,
    NavigationItemBadgeDirective,
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Calendar implements AfterViewInit, OnDestroy {
  private scheduleDataService = inject(ScheduleDataService);
  private breadcrumbsStore = inject(BreadcrumbsStore);
  private dialog = inject(MatDialog);

  readonly currentView = signal<CalendarView>('timeGridDay');
  readonly calendarComponent = viewChild.required<FullCalendarComponent>('calendar');
  readonly calendarContainer = viewChild.required<ElementRef<HTMLElement>>('calendarContainer');

  readonly viewDate = signal(new Date('2028-09-02T00:00:00'));
  readonly scheduleFilters = this.scheduleDataService.scheduleFilters;
  readonly categories = this.scheduleDataService.categories;
  readonly allEvents = this.scheduleDataService.events;

  readonly visibleEvents = computed(() => {
    const filterId = this.selectedCategoryFilter();
    const events = this.allEvents();

    if (!filterId) {
      return events;
    }

    return events.filter(event => event.category === filterId);
  });

  readonly calendarEvents = computed((): FullCalendarEvent[] => {
    const events = this.visibleEvents();
    const cats = this.categories();
    const categoryColorMap = new Map(cats.map(c => [c.id, c.color]));
    const defaultColor = '#808080';
    return events.map(event => ({
      id: event.id,
      title: event.title,
      start: event.startTime,
      end: event.endTime,
      color: categoryColorMap.get(event.category) || defaultColor,
      extendedProps: {
        category: event.category,
      },
    }));
  });

  readonly calendarOptions = computed((): CalendarOptions => {
    return {
      plugins: [timeGridPlugin, interactionPlugin, dayGridPlugin],
      initialView: this.currentView(),
      initialDate: this.viewDate(),
      headerToolbar: false,
      events: this.calendarEvents(),
      editable: true,
      eventClick: (clickInfo: EventClickArg) => this.openEditEventDialog(clickInfo),
      datesSet: (info) => {
        if (info.view.currentStart.getTime() !== this.viewDate().getTime()) {
          this.viewDate.set(info.view.currentStart);
        }
      }
    };
  });

  readonly selectedCategoryFilter = signal<Category['id'] | null>(null);

  private resizeObserver: ResizeObserver | null = null;

  constructor() {
    this.breadcrumbsStore.setBreadcrumbs([
      {
        id: 'home',
        name: 'Home',
        route: '/',
        type: 'link',
      },
      {
        id: 'calendar',
        name: 'Calendar',
        type: null
      }
    ]);
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.calendarComponent().getApi().updateSize();
    });
    this.resizeObserver.observe(this.calendarContainer().nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
  }

  onFilterChange(filterId: string, enabled: boolean): void {
    this.scheduleFilters.update((filters: any) =>
      filters.map((f: any) => f.id === filterId ? { ...f, enabled } : f)
    );
  }

  onDateChange(newDate: Date | null): void {
    const date = newDate || new Date();
    this.viewDate.set(date);
    this.calendarComponent().getApi().gotoDate(date);
  }

  onViewChange(view: string): void {
    if (!view || view === this.currentView()) {
      return;
    }

    this.calendarComponent().getApi().changeView(view);
    this.currentView.set(view as CalendarView);
  }

  openAddEventDialog(): void {
    this.openEventDialog();
  }

  openEditEventDialog(clickInfo: EventClickArg): void {
    const eventId = clickInfo.event.id;
    if (!eventId) {
      console.error("Clicked event is missing an ID.");
      return;
    }

    const eventToEdit = this.scheduleDataService.events().find(event => event.id === eventId);

    if (eventToEdit) {
      this.openEventDialog(eventToEdit);
    } else {
      console.error(`Event with ID ${eventId} not found in data source.`);
    }
  }

  onCategoryFilterSelect(categoryId: Category['id']): void {
    this.selectedCategoryFilter.set(categoryId);
  }

  clearCategoryFilter(): void {
    this.selectedCategoryFilter.set(null);
  }

  openEventDialog(data?: CalendarEvent): void {
    const dialogRef = this.dialog.open(EventFormDialog, {
      width: '500px',
      data
    });
    dialogRef.afterClosed()
      .pipe(
        filter(result => !!result)
      )
      .subscribe((result: any) => {
        const eventData: CalendarEvent = {
          id: result.id || new Date().getTime().toString(), // Используем старый ID или генерируем новый
          title: result.title,
          description: result.description,
          startTime: result.start,
          endTime: result.end,
          category:  result.category,
        };

        if (result.id) {
          this.scheduleDataService.updateEvent(eventData);
        } else {
          this.scheduleDataService.addEvent(eventData);
        }
      });
  }
}
