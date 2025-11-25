import { EventInput } from '@fullcalendar/core';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  category: Category['id'];
}

export type FullCalendarEvent = EventInput;

export interface Category {
  id: 'work' | 'personal' | 'gaming' | 'schedule' | 'friends' | 'family';
  name: string;
  color: string;
  count: number | null;
}

export interface ScheduleFilter {
  id: string;
  name: string;
  enabled: boolean;
}
