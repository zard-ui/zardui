import { TemplateRef } from '@angular/core';

export type CalendarView = 'month' | 'week' | 'day';

export interface CalendarEvent {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  description?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
}

export interface CalendarConfig {
  firstDayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  dateFormat?: string;
  monthFormat?: string;
  weekdayFormat?: string;
  headerTemplate?: TemplateRef<unknown>;
  dayCellTemplate?: TemplateRef<unknown>;
  locale?: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
  isDisabled?: boolean;
}

export interface CalendarWeek {
  days: CalendarDay[];
}

export interface CalendarMonth {
  weeks: CalendarWeek[];
}
