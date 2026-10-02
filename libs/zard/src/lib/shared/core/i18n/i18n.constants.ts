import type { ZardCalendarI18n, ZardCalendarLabels, ZardI18nInterface } from './i18n.types';

export const DEFAULT_LOCALE = 'en-US';

export const DEFAULT_CALENDAR_LABELS: ZardCalendarLabels = {
  today: 'Today',
  nextMonth: 'Next month',
  previousMonth: 'Previous month',
  nextYear: 'Next year',
  previousYear: 'Previous year',
  chooseMonth: 'Choose the month',
  chooseYear: 'Choose the year',
  selected: 'Selected',
  rangeStart: 'Range start',
  rangeEnd: 'Range end',
  inRange: 'In range',
  outsideMonth: 'Outside month',
  disabled: 'Disabled',
};

export const DEFAULT_CALENDAR_I18N: ZardCalendarI18n = {
  weekStartsOn: 0,
  labels: DEFAULT_CALENDAR_LABELS,
};

export const DEFAULT_ZARD_I18N: ZardI18nInterface = {
  locale: DEFAULT_LOCALE,
  calendar: DEFAULT_CALENDAR_I18N,
};
