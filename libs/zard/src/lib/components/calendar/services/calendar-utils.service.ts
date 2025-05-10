import { Injectable } from '@angular/core';

import { CalendarDay, CalendarEvent, CalendarMonth, CalendarWeek } from '../models/calendar.models';

@Injectable({
  providedIn: 'root',
})
export class CalendarUtilsService {
  /**
   * Generates a calendar month grid
   * @param date The date to generate the month for
   * @param firstDayOfWeek First day of the week (0 = Sunday, 1 = Monday, etc.)
   * @param selectedDates Currently selected dates
   * @param events Calendar events to include
   * @returns A CalendarMonth object with weeks and days
   */
  generateMonthView(date: Date, firstDayOfWeek: number, selectedDates: Date[] = [], events: CalendarEvent[] = []): CalendarMonth {
    const year = date.getFullYear();
    const month = date.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);

    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);

    // Day of the week for the first day (0-6)
    let firstDayOfMonth = firstDay.getDay();

    // Adjust based on firstDayOfWeek
    firstDayOfMonth = (7 + firstDayOfMonth - firstDayOfWeek) % 7;

    const daysInMonth = lastDay.getDate();
    const weeks: CalendarWeek[] = [];

    // Calculate days from previous month to include
    const prevMonthDays = firstDayOfMonth;

    // Calculate total days to render (ensuring we have 6 weeks for consistency)
    const totalDays = Math.ceil((prevMonthDays + daysInMonth) / 7) * 7;

    let currentDay = 1 - prevMonthDays;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate the calendar grid
    for (let i = 0; i < totalDays / 7; i++) {
      const week: CalendarWeek = { days: [] };

      for (let j = 0; j < 7; j++) {
        const dayDate = new Date(year, month, currentDay);
        const isCurrentMonth = dayDate.getMonth() === month;

        // Find events for this day
        const dayEvents = events.filter(event => this.isEventOnDay(event, dayDate));

        // Check if this day is selected
        const isSelected = selectedDates.some(selectedDate => this.isSameDay(selectedDate, dayDate));

        week.days.push({
          date: dayDate,
          isCurrentMonth,
          isToday: this.isSameDay(today, dayDate),
          isSelected,
          events: dayEvents,
        });

        currentDay++;
      }

      weeks.push(week);
    }

    return { weeks };
  }

  /**
   * Generates a week view for the calendar
   * @param date The date within the week to display
   * @param firstDayOfWeek First day of the week (0 = Sunday, 1 = Monday, etc.)
   * @param selectedDates Currently selected dates
   * @param events Calendar events to include
   * @returns A CalendarWeek object with days
   */
  generateWeekView(date: Date, firstDayOfWeek: number, selectedDates: Date[] = [], events: CalendarEvent[] = []): CalendarWeek {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // Get the day of the week for the current date
    const dayOfWeek = date.getDay();

    // Calculate the first day of the week
    const diff = (dayOfWeek - firstDayOfWeek + 7) % 7;
    const firstDayOfWeek_date = new Date(year, month, day - diff);

    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Generate 7 days starting from the first day of the week
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(firstDayOfWeek_date);
      currentDate.setDate(firstDayOfWeek_date.getDate() + i);

      // Find events for this day
      const dayEvents = events.filter(event => this.isEventOnDay(event, currentDate));

      // Check if this day is selected
      const isSelected = selectedDates.some(selectedDate => this.isSameDay(selectedDate, currentDate));

      days.push({
        date: currentDate,
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: this.isSameDay(today, currentDate),
        isSelected,
        events: dayEvents,
      });
    }

    return { days };
  }

  /**
   * Generates a day view for the calendar
   * @param date The date to display
   * @param selectedDates Currently selected dates
   * @param events Calendar events to include
   * @returns A CalendarDay object
   */
  generateDayView(date: Date, selectedDates: Date[] = [], events: CalendarEvent[] = []): CalendarDay {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find events for this day
    const dayEvents = events.filter(event => this.isEventOnDay(event, date));

    // Check if this day is selected
    const isSelected = selectedDates.some(selectedDate => this.isSameDay(selectedDate, date));

    return {
      date: new Date(date),
      isCurrentMonth: date.getMonth() === today.getMonth(),
      isToday: this.isSameDay(today, date),
      isSelected,
      events: dayEvents,
    };
  }

  /**
   * Checks if an event falls on a specific day
   * @param event The calendar event
   * @param day The day to check
   * @returns True if the event is on the specified day
   */
  isEventOnDay(event: CalendarEvent, day: Date): boolean {
    // Set time to start of day for comparison
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    // Check if event overlaps with the day
    return (event.start <= dayEnd && event.end >= dayStart) || this.isSameDay(event.start, day) || this.isSameDay(event.end, day);
  }

  /**
   * Checks if two dates represent the same day
   */
  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  }

  /**
   * Gets an array of localized weekday names
   */
  getWeekdayNames(locale: string, format: 'long' | 'short' | 'narrow' = 'short', firstDayOfWeek = 0): string[] {
    const weekdays = [];
    const date = new Date(2000, 0, 2 + firstDayOfWeek); // Jan 2, 2000 is a Sunday

    for (let i = 0; i < 7; i++) {
      weekdays.push(date.toLocaleDateString(locale, { weekday: format }));
      date.setDate(date.getDate() + 1);
    }

    return weekdays;
  }

  /**
   * Format a date according to the specified format and locale
   */
  formatDate(date: Date, locale = 'en-US', format?: string): string {
    if (format) {
      // This is a simplified implementation
      // In a real app, you might want to use a library like date-fns
      return date.toLocaleDateString(locale, { dateStyle: 'full' });
    }
    return date.toLocaleDateString(locale, { dateStyle: 'full' });
  }
}
