import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

// Register English locale (add more locales as needed)
try {
  TimeAgo.addDefaultLocale(en);
} catch {
  // Locale already registered, ignore
}

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
  private localeId = inject(LOCALE_ID);

  transform(value: string | Date | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    let date: Date;
    if (value instanceof Date) {
      date = value;
    } else {
      date = new Date(value);
    }

    if (isNaN(date.getTime())) {
      return '';
    }

    try {
      const timeAgo = new TimeAgo(this.localeId);
      return timeAgo.format(date);
    } catch {
      // Fallback to default locale if localeId is not registered
      const timeAgo = new TimeAgo('en');
      return timeAgo.format(date);
    }
  }
}
