export type CalendarMode = 'single' | 'multiple' | 'range';
export type CalendarValue = Date | Date[] | null;

/**
 * How the month/year caption is rendered:
 *
 * - `label` — a single `"{Month} {Year}"` text
 * - `dropdown` — a month select plus a year select
 * - `dropdown-months` — a month select, year as text
 * - `dropdown-years` — month as text, a year select
 */
export type ZardCalendarCaptionLayout = 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years';

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  isRangeStart?: boolean;
  isRangeEnd?: boolean;
  isInRange?: boolean;
  id?: string;
}

export interface CalendarDayConfig {
  year: number;
  month: number;
  mode: CalendarMode;
  selectedDates: Date[];
  minDate: Date | null;
  maxDate: Date | null;
  disabled: boolean;
  /** Individual days that cannot be selected, on top of the min/max range. */
  disabledDates?: Date[];
}
