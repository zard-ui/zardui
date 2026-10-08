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
