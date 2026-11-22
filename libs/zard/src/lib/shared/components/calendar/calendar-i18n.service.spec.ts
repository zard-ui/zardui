import { TestBed } from '@angular/core/testing';

import {
  DEFAULT_CALENDAR_LABELS,
  DEFAULT_LOCALE,
  de_DE,
  provideZardI18n,
  type ZardCalendarLabels,
  type ZardI18nInterface,
  ZardI18nService,
} from '@/shared/core/i18n';

import { ZardCalendarI18nService } from './calendar-i18n.service';

describe('ZardCalendarI18nService', () => {
  it('should derive default calendar labels and weekStartsOn when unconfigured', () => {
    TestBed.configureTestingModule({});
    const calendarI18n = TestBed.inject(ZardCalendarI18nService);

    expect(calendarI18n.locale()).toBe(DEFAULT_LOCALE);
    expect(calendarI18n.weekStartsOn()).toBe(0);
    expect(calendarI18n.labels()).toEqual(DEFAULT_CALENDAR_LABELS);
    expect(calendarI18n.getWeekStartsOn()).toBe(0);
    expect(calendarI18n.getLabels()).toEqual(DEFAULT_CALENDAR_LABELS);
  });

  it('should reactively reflect changes when core ZardI18nService changes locale', () => {
    TestBed.configureTestingModule({});
    const i18n = TestBed.inject(ZardI18nService);
    const calendarI18n = TestBed.inject(ZardCalendarI18nService);

    i18n.setLocale(de_DE);
    expect(calendarI18n.locale()).toBe('de-DE');
    expect(calendarI18n.weekStartsOn()).toBe(1);
    expect(calendarI18n.labels().today).toBe('Heute');
    expect(calendarI18n.labels().nextMonth).toBe('Nächster Monat');
  });

  it('should defensively preserve other labels when partial calendar translation is applied', () => {
    TestBed.configureTestingModule({});
    const i18n = TestBed.inject(ZardI18nService);
    const calendarI18n = TestBed.inject(ZardCalendarI18nService);

    i18n.setTranslation({
      calendar: {
        labels: { today: 'Ce jour' } as unknown as ZardCalendarLabels,
      },
    });

    expect(calendarI18n.labels().today).toBe('Ce jour');
    expect(calendarI18n.labels().nextMonth).toBe('Next month');
    expect(calendarI18n.labels().previousMonth).toBe('Previous month');
  });

  it('should work seamlessly with provideZardI18n preset', () => {
    TestBed.configureTestingModule({
      providers: [provideZardI18n('es-ES')],
    });
    const calendarI18n = TestBed.inject(ZardCalendarI18nService);

    expect(calendarI18n.locale()).toBe('es-ES');
    expect(calendarI18n.weekStartsOn()).toBe(1);
    expect(calendarI18n.labels().today).toBe('Hoy');
    expect(calendarI18n.labels().previousMonth).toBe('Mes anterior');
  });

  it('should work seamlessly with custom preset object in provideZardI18n', () => {
    const customLocale: ZardI18nInterface = {
      locale: 'uk-UA',
      calendar: {
        weekStartsOn: 1,
        labels: {
          today: 'Сьогодні',
          nextMonth: 'Наступний місяць',
          previousMonth: 'Попередній місяць',
          nextYear: 'Наступний рік',
          previousYear: 'Попередній рік',
        },
      },
    };

    TestBed.configureTestingModule({
      providers: [provideZardI18n(customLocale)],
    });
    const calendarI18n = TestBed.inject(ZardCalendarI18nService);

    expect(calendarI18n.locale()).toBe('uk-UA');
    expect(calendarI18n.weekStartsOn()).toBe(1);
    expect(calendarI18n.labels().today).toBe('Сьогодні');
    expect(calendarI18n.labels().nextMonth).toBe('Наступний місяць');
  });

  describe('month and weekday localization', () => {
    it('should generate localized short and long month names for default en-US', () => {
      TestBed.configureTestingModule({});
      const calendarI18n = TestBed.inject(ZardCalendarI18nService);

      expect(calendarI18n.shortMonths()).toHaveLength(12);
      expect(calendarI18n.shortMonths()[0]).toBe('Jan');
      expect(calendarI18n.shortMonths()[11]).toBe('Dec');
      expect(calendarI18n.longMonths()).toHaveLength(12);
      expect(calendarI18n.longMonths()[0]).toBe('January');
      expect(calendarI18n.longMonths()[6]).toBe('July');
      expect(calendarI18n.longMonths()[11]).toBe('December');
      expect(calendarI18n.getMonthNames('short')[0]).toBe('Jan');
      expect(calendarI18n.getMonthNames('long')[0]).toBe('January');
    });

    it('should generate localized weekday names starting on Sunday (0) for en-US', () => {
      TestBed.configureTestingModule({});
      const calendarI18n = TestBed.inject(ZardCalendarI18nService);

      const weekdays = calendarI18n.weekdays();
      expect(weekdays).toHaveLength(7);
      expect(weekdays).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
      expect(calendarI18n.getWeekdayNames('narrow')[0]).toBe('S');
    });

    it('should generate localized weekday names starting on Monday (1) for en-US', () => {
      TestBed.configureTestingModule({});
      const calendarI18n = TestBed.inject(ZardCalendarI18nService);

      const weekdays = calendarI18n.getWeekdayNames('short', 1);
      expect(weekdays).toHaveLength(7);
      expect(weekdays).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
    });

    it('should handle weekStartsOn = 6 (Saturday)', () => {
      TestBed.configureTestingModule({});
      const calendarI18n = TestBed.inject(ZardCalendarI18nService);

      const weekdays = calendarI18n.getWeekdayNames('short', 6);
      expect(weekdays[0]).toBe('Sat');
      expect(weekdays[1]).toBe('Sun');
      expect(weekdays[6]).toBe('Fri');
    });

    it('should reactively update month names and weekdays when locale changes to fr-FR', () => {
      TestBed.configureTestingModule({
        providers: [provideZardI18n('fr-FR')],
      });
      const calendarI18n = TestBed.inject(ZardCalendarI18nService);

      expect(calendarI18n.weekStartsOn()).toBe(1);
      expect(calendarI18n.weekdays()).toEqual(['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim']);
      expect(calendarI18n.longMonths()[0]).toBe('janvier');
      expect(calendarI18n.longMonths()[1]).toBe('février');
      expect(calendarI18n.longMonths()[7]).toBe('août');
      expect(calendarI18n.longMonths()[11]).toBe('décembre');
    });

    it('should return localized month and weekday names for de-DE', () => {
      TestBed.configureTestingModule({
        providers: [provideZardI18n('de-DE')],
      });
      const calendarI18n = TestBed.inject(ZardCalendarI18nService);

      expect(calendarI18n.longMonths()[0]).toBe('Januar');
      expect(calendarI18n.longMonths()[2]).toBe('März');
      expect(calendarI18n.longMonths()[9]).toBe('Oktober');
      expect(calendarI18n.weekdays()).toEqual(['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']);
    });

    it('should return localized month names for es-ES', () => {
      TestBed.configureTestingModule({
        providers: [provideZardI18n('es-ES')],
      });
      const calendarI18n = TestBed.inject(ZardCalendarI18nService);

      expect(calendarI18n.longMonths()[0]).toBe('enero');
      expect(calendarI18n.longMonths()[3]).toBe('abril');
      expect(calendarI18n.longMonths()[11]).toBe('diciembre');
    });
  });
});
