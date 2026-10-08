import { computed, inject, Injectable } from '@angular/core';

import {
  DEFAULT_CALENDAR_I18N,
  DEFAULT_CALENDAR_LABELS,
  type ZardCalendarI18n,
  type ZardCalendarLabels,
  type ZardDayOfWeek,
  ZardI18nService,
} from '@/shared/core/i18n';

import { makeSafeDate } from './calendar.utils';

export function capitalize(str: string, locale?: string): string {
  if (!str) {
    return str;
  }
  return str.charAt(0).toLocaleUpperCase(locale) + str.slice(1);
}

@Injectable({
  providedIn: 'root',
})
export class ZardCalendarI18nService {
  private readonly i18n = inject(ZardI18nService);

  private readonly calendarData = this.i18n.getLocaleData<ZardCalendarI18n>('calendar', DEFAULT_CALENDAR_I18N);

  readonly locale = this.i18n.locale;

  readonly weekStartsOn = computed<ZardDayOfWeek>(() => {
    const data = this.calendarData();
    return data?.weekStartsOn ?? DEFAULT_CALENDAR_I18N.weekStartsOn ?? 0;
  });

  readonly labels = computed<ZardCalendarLabels>(() => {
    const data = this.calendarData();
    return {
      ...DEFAULT_CALENDAR_LABELS,
      ...(data?.labels ?? {}),
    };
  });

  readonly shortMonths = computed(() => this.getMonthNames('short'));
  readonly longMonths = computed(() => this.getMonthNames('long'));
  readonly weekdays = computed(() => this.getWeekdayNames());

  getMonthNames(format: 'short' | 'long' = 'short', locale: string = this.locale()): string[] {
    const formatter = new Intl.DateTimeFormat(locale, { month: format });
    return Array.from({ length: 12 }, (_, i) => {
      const date = makeSafeDate(2024, i, 1);
      return capitalize(formatter.format(date), locale);
    });
  }

  getWeekdayNames(
    format: 'short' | 'narrow' | 'long' = 'short',
    weekStartsOn: ZardDayOfWeek = this.weekStartsOn(),
    locale: string = this.locale(),
  ): string[] {
    const formatter = new Intl.DateTimeFormat(locale, { weekday: format });
    return Array.from({ length: 7 }, (_, i) => {
      const dayIndex = (weekStartsOn + i) % 7;
      const date = makeSafeDate(2024, 0, 7 + dayIndex);
      return capitalize(formatter.format(date).replace(/\.$/, ''), locale);
    });
  }

  getWeekStartsOn(): ZardDayOfWeek {
    return this.weekStartsOn();
  }

  getLabels(): ZardCalendarLabels {
    return this.labels();
  }
}
