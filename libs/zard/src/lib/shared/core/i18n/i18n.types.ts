export interface ZardCalendarLabels {
  today: string;
  nextMonth: string;
  previousMonth: string;
  nextYear: string;
  previousYear: string;
  chooseMonth?: string;
  chooseYear?: string;
  selected?: string;
  rangeStart?: string;
  rangeEnd?: string;
  inRange?: string;
  outsideMonth?: string;
  disabled?: string;
}

export type ZardDayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type ZardWeekStartsOn = ZardDayOfWeek;

export interface ZardCalendarI18n {
  weekStartsOn?: ZardDayOfWeek;
  labels?: Partial<ZardCalendarLabels>;
}

export interface ZardI18nInterface {
  locale: string;
  calendar?: ZardCalendarI18n;
  [key: string]: unknown;
}
