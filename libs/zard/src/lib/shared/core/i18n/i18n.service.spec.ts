import { LOCALE_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { DEFAULT_CALENDAR_I18N, DEFAULT_CALENDAR_LABELS, DEFAULT_LOCALE } from './i18n.constants';
import { provideZardI18n } from './i18n.provider';
import { ZardI18nService } from './i18n.service';
import { ZARD_I18N, ZARD_LOCALE } from './i18n.tokens';
import type { ZardCalendarLabels, ZardI18nInterface } from './i18n.types';
import { de_DE } from './locales/de-de';
import { en_US } from './locales/en-us';
import { es_ES } from './locales/es-es';
import { fr_FR } from './locales/fr-fr';
import { it_IT } from './locales/it-it';
import { pt_BR } from './locales/pt-br';
import { pt_PT } from './locales/pt-pt';

describe('i18n module', () => {
  describe('Tokens and Presets', () => {
    it('should declare InjectionTokens with correct descriptions', () => {
      expect(ZARD_LOCALE.toString()).toContain('ZARD_LOCALE');
      expect(ZARD_I18N.toString()).toContain('ZARD_I18N');
    });

    it('should have valid DEFAULT_CALENDAR_LABELS and DEFAULT_CALENDAR_I18N', () => {
      expect(DEFAULT_CALENDAR_LABELS.today).toBe('Today');
      expect(DEFAULT_CALENDAR_LABELS.nextMonth).toBe('Next month');
      expect(DEFAULT_CALENDAR_LABELS.previousMonth).toBe('Previous month');
      expect(DEFAULT_CALENDAR_LABELS.nextYear).toBe('Next year');
      expect(DEFAULT_CALENDAR_LABELS.previousYear).toBe('Previous year');

      expect(DEFAULT_CALENDAR_I18N.weekStartsOn).toBe(0);
      expect(DEFAULT_CALENDAR_I18N.labels).toEqual(DEFAULT_CALENDAR_LABELS);
    });
  });

  describe('Standard Locales', () => {
    const locales: [string, ZardI18nInterface, 0 | 1][] = [
      ['en_US', en_US, 0],
      ['fr_FR', fr_FR, 1],
      ['es_ES', es_ES, 1],
      ['de_DE', de_DE, 1],
      ['it_IT', it_IT, 1],
      ['pt_BR', pt_BR, 0],
      ['pt_PT', pt_PT, 1],
    ];

    it.each(locales)(
      'should define complete preset %s with correct weekStartsOn %d',
      (_name, preset, expectedWeekStartsOn) => {
        expect(preset.locale).toBeTruthy();
        expect(preset.calendar).toBeDefined();
        expect(preset.calendar?.weekStartsOn).toBe(expectedWeekStartsOn);
        expect(preset.calendar?.labels?.today).toBeTruthy();
        expect(preset.calendar?.labels?.nextMonth).toBeTruthy();
        expect(preset.calendar?.labels?.previousMonth).toBeTruthy();
        expect(preset.calendar?.labels?.nextYear).toBeTruthy();
        expect(preset.calendar?.labels?.previousYear).toBeTruthy();
      },
    );

    it('should have accurate native translations', () => {
      expect(fr_FR.calendar?.labels?.today).toBe("Aujourd'hui");
      expect(es_ES.calendar?.labels?.today).toBe('Hoy');
      expect(de_DE.calendar?.labels?.today).toBe('Heute');
      expect(it_IT.calendar?.labels?.today).toBe('Oggi');
      expect(pt_BR.calendar?.labels?.today).toBe('Hoje');
      expect(pt_PT.calendar?.labels?.today).toBe('Hoje');
    });
  });

  describe('ZardI18nService', () => {
    it('should default to en-US when unconfigured', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(ZardI18nService);

      expect(service.locale()).toBe(DEFAULT_LOCALE);
      expect(service.getLocale()).toBe(DEFAULT_LOCALE);
      expect(service.current().locale).toBe(DEFAULT_LOCALE);
    });

    it('should fallback to LOCALE_ID if provided and ZARD tokens are unprovided', () => {
      TestBed.configureTestingModule({
        providers: [{ provide: LOCALE_ID, useValue: 'fr' }],
      });
      const service = TestBed.inject(ZardI18nService);

      expect(service.locale()).toBe('fr');
      expect(service.current().locale).toBe('fr');
    });

    it('should prioritize ZARD_LOCALE over LOCALE_ID', () => {
      TestBed.configureTestingModule({
        providers: [
          { provide: LOCALE_ID, useValue: 'en-US' },
          { provide: ZARD_LOCALE, useValue: 'es-ES' },
        ],
      });
      const service = TestBed.inject(ZardI18nService);

      expect(service.locale()).toBe('es-ES');
    });

    it('should prioritize ZARD_I18N over ZARD_LOCALE and LOCALE_ID', () => {
      TestBed.configureTestingModule({
        providers: [
          { provide: LOCALE_ID, useValue: 'en-US' },
          { provide: ZARD_LOCALE, useValue: 'es-ES' },
          { provide: ZARD_I18N, useValue: fr_FR },
        ],
      });
      const service = TestBed.inject(ZardI18nService);

      expect(service.locale()).toBe('fr-FR');
      expect(service.current()).toEqual(fr_FR);
    });

    it('should reactively update when setLocale(string) is called', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(ZardI18nService);

      service.setLocale('de-DE');
      expect(service.locale()).toBe('de-DE');
      expect(service.current().locale).toBe('de-DE');
    });

    it('should reactively update when setLocale(ZardI18nInterface) is called', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(ZardI18nService);

      service.setLocale(de_DE);
      expect(service.locale()).toBe('de-DE');
      expect(service.current()).toEqual(de_DE);
    });

    it('should reactively provide component sub-dictionary via getLocaleData()', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(ZardI18nService);

      const calendarSignal = service.getLocaleData('calendar', DEFAULT_CALENDAR_I18N);
      expect(calendarSignal()).toEqual(DEFAULT_CALENDAR_I18N);

      service.setLocale(fr_FR);
      expect(calendarSignal()).toEqual(fr_FR.calendar);
    });

    it('should reactively update and defensively merge partial translations via setTranslation()', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(ZardI18nService);

      service.setLocale(fr_FR);
      service.setTranslation({
        calendar: {
          labels: { today: 'Ce jour' } as unknown as ZardCalendarLabels,
        },
      });

      const currentCalendar = service.current().calendar;
      expect(currentCalendar?.labels?.today).toBe('Ce jour');
      expect(currentCalendar?.labels?.nextMonth).toBe('Mois suivant');
      expect(currentCalendar?.weekStartsOn).toBe(1);
    });
  });

  describe('provideZardI18n', () => {
    it('should provide default services with provideZardI18n()', () => {
      TestBed.configureTestingModule({
        providers: [provideZardI18n()],
      });
      const service = TestBed.inject(ZardI18nService);

      expect(service.locale()).toBe('en-US');
      expect(service.current().locale).toBe('en-US');
    });

    it('should configure string locale with provideZardI18n("es-ES") and automatically resolve preset', () => {
      TestBed.configureTestingModule({
        providers: [provideZardI18n('es-ES')],
      });
      const service = TestBed.inject(ZardI18nService);

      expect(service.locale()).toBe('es-ES');
      expect(service.current().locale).toBe('es-ES');
      expect(service.getLocaleData('calendar')()).toEqual(es_ES.calendar);
    });

    it('should configure full locale preset with provideZardI18n(it_IT)', () => {
      TestBed.configureTestingModule({
        providers: [provideZardI18n(it_IT)],
      });
      const service = TestBed.inject(ZardI18nService);

      expect(service.locale()).toBe('it-IT');
      expect(service.current()).toEqual(it_IT);
      expect(service.getLocaleData('calendar')()).toEqual(it_IT.calendar);
    });

    it('should configure custom locale preset object with provideZardI18n(customPreset)', () => {
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
      const service = TestBed.inject(ZardI18nService);

      expect(service.locale()).toBe('uk-UA');
      expect(service.current()).toEqual(customLocale);
      expect(service.getLocaleData('calendar')()).toEqual(customLocale.calendar);
    });
  });
});
