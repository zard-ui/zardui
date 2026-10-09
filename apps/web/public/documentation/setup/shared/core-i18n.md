```typescript title="i18n.constants.ts" expandable="true" copyButton showLineNumbers
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
```

```typescript title="i18n.provider.ts" expandable="true" copyButton showLineNumbers
import { makeEnvironmentProviders } from '@angular/core';
import type { EnvironmentProviders } from '@angular/core';

import { DEFAULT_LOCALE } from './i18n.constants';
import { ZARD_I18N, ZARD_LOCALE } from './i18n.tokens';
import type { ZardI18nInterface } from './i18n.types';

export function provideZardI18n(locale: ZardI18nInterface | string = DEFAULT_LOCALE): EnvironmentProviders {
  if (typeof locale === 'string') {
    return makeEnvironmentProviders([{ provide: ZARD_LOCALE, useValue: locale }]);
  }
  return makeEnvironmentProviders([
    { provide: ZARD_LOCALE, useValue: locale.locale },
    { provide: ZARD_I18N, useValue: locale },
  ]);
}
```

```typescript title="i18n.service.ts" expandable="true" copyButton showLineNumbers
import { computed, inject, Injectable, LOCALE_ID, signal } from '@angular/core';
import type { Signal } from '@angular/core';

import { DEFAULT_LOCALE } from './i18n.constants';
import { ZARD_I18N, ZARD_LOCALE } from './i18n.tokens';
import type { ZardI18nInterface } from './i18n.types';
import { getPresetLocale } from './locales/registry';

function isPlainObject(item: unknown): item is Record<string, unknown> {
  return typeof item === 'object' && item !== null && !Array.isArray(item);
}

function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result: Record<string, unknown> = { ...target };
  for (const [key, sourceVal] of Object.entries(source)) {
    const targetVal = target[key];
    if (isPlainObject(sourceVal) && isPlainObject(targetVal)) {
      result[key] = deepMerge(targetVal, sourceVal);
    } else if (sourceVal !== undefined) {
      result[key] = sourceVal;
    }
  }
  return result as T;
}

@Injectable({
  providedIn: 'root',
})
export class ZardI18nService {
  private readonly injectedI18n = inject(ZARD_I18N, { optional: true });
  private readonly injectedLocale = inject(ZARD_LOCALE, { optional: true });
  private readonly ngLocaleId = inject(LOCALE_ID, { optional: true });

  private readonly state = signal<ZardI18nInterface>(this.initInitialState());

  readonly locale: Signal<string> = computed(() => this.state().locale);

  readonly current: Signal<ZardI18nInterface> = this.state.asReadonly();

  setLocale(locale: ZardI18nInterface | string): void {
    if (typeof locale !== 'string') {
      this.state.set(locale);
      return;
    }

    const preset = getPresetLocale(locale);
    this.state.set({ ...(preset ?? {}), locale });
  }

  setTranslation(translation: Partial<ZardI18nInterface>): void {
    this.state.update(
      current =>
        deepMerge(current as Record<string, unknown>, translation as Record<string, unknown>) as ZardI18nInterface,
    );
  }

  getLocale(): string {
    return this.locale();
  }

  getCurrent(): ZardI18nInterface {
    return this.state();
  }

  getLocaleData<T>(key: string, defaultValue?: T): Signal<T> {
    return computed(() => {
      const data = (this.state() as Record<string, unknown>)[key];
      return (data !== undefined ? data : defaultValue) as T;
    });
  }

  private initInitialState(): ZardI18nInterface {
    if (this.injectedI18n) {
      return this.injectedI18n;
    }
    const resolvedLocale =
      this.injectedLocale ??
      (typeof this.ngLocaleId === 'string' && this.ngLocaleId ? this.ngLocaleId : DEFAULT_LOCALE);

    const preset = getPresetLocale(resolvedLocale);
    return { ...(preset ?? {}), locale: resolvedLocale };
  }
}
```

```typescript title="i18n.tokens.ts" expandable="true" copyButton showLineNumbers
import { InjectionToken } from '@angular/core';

import type { ZardI18nInterface } from './i18n.types';

export const ZARD_LOCALE = new InjectionToken<string>('ZARD_LOCALE');
export const ZARD_I18N = new InjectionToken<ZardI18nInterface>('ZARD_I18N');
```

```typescript title="i18n.types.ts" expandable="true" copyButton showLineNumbers
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
```

```typescript title="index.ts" expandable="true" copyButton showLineNumbers
export * from './i18n.types';
export * from './i18n.constants';
export * from './i18n.tokens';
export * from './i18n.service';
export * from './i18n.provider';
export * from './locales/registry';
export * from './locales/en-us';
export * from './locales/fr-fr';
export * from './locales/es-es';
export * from './locales/de-de';
export * from './locales/it-it';
export * from './locales/pt-br';
export * from './locales/pt-pt';
```
