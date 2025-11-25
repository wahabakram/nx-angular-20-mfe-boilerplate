import { Injectable, signal } from '@angular/core';
import { CalendarEvent, Category, ScheduleFilter } from './types';

@Injectable({
  providedIn: 'root',
})
export class ScheduleDataService {
  public readonly events = signal<CalendarEvent[]>([
    {
      id: 'evt1',
      title: 'Writing Event',
      startTime: new Date('2028-09-02T07:00:00'),
      endTime: new Date('2028-09-02T08:00:00'),
      category: 'work',
    },
    {
      id: 'evt2',
      title: 'Enjoy Coffee',
      startTime: new Date('2028-09-02T10:00:00'),
      endTime: new Date('2028-09-02T10:30:00'),
      category: 'personal',
    },
    {
      id: 'evt3',
      title: 'Learn Computer Science',
      startTime: new Date('2028-09-02T13:00:00'),
      endTime: new Date('2028-09-02T14:00:00'),
      category: 'work',
    },
    {
      id: 'evt4',
      title: 'Write SaaS Webapp',
      startTime: new Date('2028-09-02T17:00:00'),
      endTime: new Date('2028-09-02T18:00:00'),
      category: 'work',
    },
    {
      id: 'evt5',
      title: 'Dien in Peace',
      startTime: new Date('2028-09-02T20:00:00'),
      endTime: new Date('2028-09-02T21:00:00'),
      category: 'gaming',
    },
  ]);

  // Цвета теперь - простые hex-строки
  public readonly categories = signal<Category[]>([
    { id: 'work', name: 'Work', count: 25, color: '#1e90ff' },
    { id: 'personal', name: 'Personal', count: null, color: '#e3bc08' },
    { id: 'schedule', name: 'Schedule', count: null, color: '#8A2BE2' },
    { id: 'gaming', name: 'Gaming', count: 2, color: '#228B22' },
    { id: 'friends', name: 'Friends', count: null, color: '#FFD700' },
    { id: 'family', name: 'Family', count: 8, color: '#4B0082' },
  ]);

  public readonly scheduleFilters = signal<ScheduleFilter[]>([
    { id: 'sf1', name: 'Daily Standup', enabled: true },
    { id: 'sf2', name: 'Weekly Review', enabled: true },
    { id: 'sf3', name: 'Team Meeting', enabled: true },
    { id: 'sf4', name: 'Lunch Break', enabled: false },
    { id: 'sf5', name: 'Client Meeting', enabled: true },
    { id: 'sf6', name: 'Other', enabled: false },
  ]);

  addEvent(newEvent: CalendarEvent): void {
    this.events.update((currentEvents) => [...currentEvents, newEvent]);
  }

  updateEvent(updatedEvent: CalendarEvent): void {
    this.events.update((currentEvents) =>
      currentEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  }
}
