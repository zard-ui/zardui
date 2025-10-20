import type { CalendarDay, CalendarDayConfig, CalendarMode, CalendarValue } from './calendar.types';

/**
 * Checks if two dates represent the same day (ignoring time)
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
}

/**
 * Checks if a date is disabled based on min/max constraints
 */
export function isDateDisabled(date: Date, minDate: Date | null, maxDate: Date | null): boolean {
  if (minDate && date < minDate) return true;
  if (maxDate && date > maxDate) return true;
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
  if (!value) return [];

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

  const labels = [dateStr];

  if (day.isToday) labels.push('Today');
  if (day.isSelected) labels.push('Selected');
  if (day.isRangeStart) labels.push('Range start');
  if (day.isRangeEnd) labels.push('Range end');
  if (day.isInRange) labels.push('In range');
  if (!day.isCurrentMonth) labels.push('Outside month');
  if (day.isDisabled) labels.push('Disabled');

  return labels.join(', ');
}
