import type { CalendarDay, CalendarDayConfig, CalendarMode, CalendarValue } from './calendar.types';

export const calendarMonths = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export const calendarWeekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const;

/**
 * Checks if two dates represent the same day (ignoring time)
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Checks if a date is disabled based on min/max constraints
 */
export function isDateDisabled(date: Date, minDate: Date | null, maxDate: Date | null): boolean {
  if ((minDate && date < minDate) || (maxDate && date > maxDate)) {
    return true;
  }
  return false;
}

/**
 * Generates calendar days for a given month with all selection states
 */
export function generateCalendarDays(config: CalendarDayConfig): CalendarDay[] {
  const { year, month, mode, selectedDates, minDate, maxDate, disabled } = config;

  const today = new Date();

  // Get first day of the month
  const firstDay = new Date(year, month, 1);
  // Get last day of the month
  const lastDay = new Date(year, month + 1, 0);

  // Get the first day of the week for the first day of the month
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  // Get the last day of the week for the last day of the month
  const endDate = new Date(lastDay);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days: CalendarDay[] = [];
  const currentWeekDate = new Date(startDate);

  // For range mode, determine range start and end
  let rangeStart: Date | null = null;
  let rangeEnd: Date | null = null;
  if (mode === 'range' && selectedDates.length > 0) {
    rangeStart = selectedDates[0];
    rangeEnd = selectedDates.length > 1 ? selectedDates[1] : null;
  }

  while (currentWeekDate <= endDate) {
    const date = new Date(currentWeekDate);
    const isCurrentMonth = date.getMonth() === month;
    const isToday = isSameDay(date, today);
    const isDisabledDate = disabled || isDateDisabled(date, minDate, maxDate);

    // Determine if date is selected
    let isSelected = false;
    let isRangeStart = false;
    let isRangeEnd = false;
    let isInRange = false;

    if (mode === 'single') {
      isSelected = selectedDates.length > 0 && isSameDay(date, selectedDates[0]);
    } else if (mode === 'multiple') {
      isSelected = selectedDates.some(d => isSameDay(date, d));
    } else if (mode === 'range') {
      if (rangeStart && isSameDay(date, rangeStart)) {
        isRangeStart = true;
        isSelected = true;
      }
      if (rangeEnd && isSameDay(date, rangeEnd)) {
        isRangeEnd = true;
        isSelected = true;
      }
      if (rangeStart && rangeEnd && !isRangeStart && !isRangeEnd) {
        // Check if date is between start and end
        const dateTime = date.getTime();
        const startTime = rangeStart.getTime();
        const endTime = rangeEnd.getTime();
        isInRange = dateTime > startTime && dateTime < endTime;
      }
    }

    days.push({
      date,
      isCurrentMonth,
      isToday,
      isSelected,
      isDisabled: isDisabledDate,
      isRangeStart,
      isRangeEnd,
      isInRange,
    });

    currentWeekDate.setDate(currentWeekDate.getDate() + 1);
  }

  return days;
}

/**
 * Converts CalendarValue to array of Dates for easier processing
 */
export function getSelectedDatesArray(value: CalendarValue, mode: CalendarMode): Date[] {
  if (!value) {
    return [];
  }

  if (mode === 'single') {
    return [value as Date];
  }

  if ((mode === 'multiple' || mode === 'range') && Array.isArray(value)) {
    return value;
  }

  return [];
}

/**
 * Generates a unique ID for a calendar day
 */
export function getDayId(index: number): string {
  return `calendar-day-${index}`;
}

/**
 * Generates an accessible ARIA label for a calendar day
 */
export function getDayAriaLabel(day: CalendarDay): string {
  const dateStr = day.date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const labels = [
    dateStr,
    day.isToday && 'Today',
    day.isSelected && 'Selected',
    day.isRangeStart && 'Range start',
    day.isRangeEnd && 'Range end',
    day.isInRange && 'In range',
    !day.isCurrentMonth && 'Outside month',
    day.isDisabled && 'Disabled',
  ].filter(Boolean);

  return labels.join(', ');
}

/**
 * Creates a date positioned safely at midday to avoid timezone-based
 * month/day shifts triggered by local DST or UTC conversions.
 *
 * Useful when constructing calendar/navigation dates where 00:00
 * may incorrectly roll the date backward or forward.
 */
export function makeSafeDate(year: number, month: number, day = 1): Date {
  const date = new Date(year, month, day);
  date.setHours(12, 0, 0, 0);
  return date;
}

/**
 * Normalizes any calendar value into a valid Date or array of Dates.
 * Returns null for empty values, validates single Dates, converts arrays,
 * and attempts to parse any other type into a Date.
 */
export function normalizeCalendarValue(v: CalendarValue): CalendarValue {
  if (!v) {
    return v;
  }

  if (v instanceof Date) {
    return toValidDate(v);
  }

  if (Array.isArray(v)) {
    return v.reduce<Date[]>((acc, d) => {
      const date = toValidDate(d);
      if (date) {
        acc.push(date);
      }
      return acc;
    }, []);
  }

  return toValidDate(v);
}

/**
 * Converts any value into a valid Date.
 * If it is already a Date, it is returned as is.
 * If the conversion fails, null should be returned.
 */
export function toValidDate(value: unknown): Date | null {
  if (value instanceof Date) {
    return isNaN(value.getTime()) ? null : value;
  }

  if (typeof value === 'number' && value.toString().length === 8) {
    const s = value.toString();
    const y = +s.slice(0, 4);
    const m = +s.slice(4, 6) - 1;
    const d = +s.slice(6, 8);

    return makeSafeDate(y, m, d);
  }

  if (typeof value === 'string' && /^\d{8}$/.test(value)) {
    const y = +value.slice(0, 4);
    const m = +value.slice(4, 6) - 1;
    const d = +value.slice(6, 8);

    return makeSafeDate(y, m, d);
  }

  const date = new Date(value as string | number | Date);

  if (isNaN(date.getTime())) {
    return null;
  }

  return makeSafeDate(date.getFullYear(), date.getMonth(), date.getDate());
}
