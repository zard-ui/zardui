---
title: Analog.js
description: Install and configure zard/ui for Analog.js.
---

# Analog.js

Install and configure zard/ui for Analog.js.

## CLI

### Create with zard/ui

The fastest path: one command scaffolds the project and configures it from a design preset, with a button already installed. If you use it, you are done: skip to the last step. To choose your own design, build it on the [create page.](/create)

```
npx zard-cli@latest create my-app --template analog
```

### Create project

Prefer to start from your own project? Create an Analog.js application. When asked to add Tailwind, answer No — the steps below configure it. [Since Tailwind is the core of the project, we do not recommend using other pre-processors.](/docs/pre-processors)

**Terminal**

```
npm create analog@latest
```

### Add Zard/ui

Prepare your entire project using the zard/ui cli. Pick "Analog.js" on the first question:

```
npx zard-cli@latest init
```

### That's it

You can now start adding components to your project. [Open the components page and select what component you want to install](/docs/components)

## Manual

### Create project

Create an Analog.js application. When asked to add Tailwind, answer No — the steps below configure it. [Since Tailwind is the core of the project, we do not recommend using other pre-processors.](/docs/pre-processors)

**Terminal**

```
npm create analog@latest
```

### Add dependencies

Add the following dependencies to your project:

```
npm install @angular/cdk class-variance-authority clsx tailwind-merge @ng-icons/core @ng-icons/lucide
```

### Add dev dependencies

Add the following dev dependencies to your project:

```
npm install -D tailwindcss @tailwindcss/vite tailwindcss-animate
```

### Configure the Tailwind pipeline

Analog builds with Vite, so Tailwind is a Vite plugin and a .postcssrc.json would never be read. Register it in vite.config.ts, and set build.cssTarget: without it Vite lowers the logical CSS the components use to left/right rules chosen by the lang attribute, and right-to-left layouts break. Also alias @ to an absolute path: on Windows Analog resolves the tsconfig @/ paths with backslashes and relative imports with forward slashes, so Vite bundles each component twice and anything that injects a parent component (input-otp, context-menu, chart) stops working.

**vite.config.ts**

```
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => ({
  build: {
    target: ['es2020'],
    cssTarget: ['chrome111', 'edge111', 'firefox128', 'safari16.4'],
  },
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src/app', import.meta.url)) },
  },
  plugins: [
    analog(),
    tailwindcss(),
  ],
}));
```

### Configure path aliases

Add these lines inside compilerOptions on your tsconfig.json. Do not add baseUrl, it is an error from TypeScript 6 on.

**tsconfig.json**

```
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/app/*"]
    }
  }
}
```

### Add the core directives

Create src/app/shared/core/directives/ with:

**string-template-outlet.directive.ts**

```
import {
  Directive,
  type EmbeddedViewRef,
  inject,
  input,
  type OnDestroy,
  TemplateRef,
  ViewContainerRef,
  effect,
  type EffectRef,
} from '@angular/core';

export function isTemplateRef<C = unknown>(value: unknown): value is TemplateRef<C> {
  return value instanceof TemplateRef;
}

export interface ZardStringTemplateOutletContext {
  $implicit: unknown;
  [key: string]: unknown;
}

@Directive({
  selector: '[zStringTemplateOutlet]',
  exportAs: 'zStringTemplateOutlet',
})
export class ZardStringTemplateOutletDirective<T = unknown> implements OnDestroy {
  private readonly viewContainer = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef<void>);

  private embeddedViewRef: EmbeddedViewRef<ZardStringTemplateOutletContext> | null = null;
  private readonly context = {} as ZardStringTemplateOutletContext;

  #isFirstChange = true;
  #lastOutletWasTemplate = false;
  #lastTemplateRef: TemplateRef<void> | null = null;
  #lastContext?: ZardStringTemplateOutletContext;

  readonly zStringTemplateOutletContext = input<ZardStringTemplateOutletContext | undefined>(undefined);
  readonly zStringTemplateOutlet = input.required<T | TemplateRef<void>>();

  #hasContextShapeChanged(context: ZardStringTemplateOutletContext | undefined): boolean {
    if (!context) {
      return false;
    }
    const prevCtxKeys = Object.keys(this.#lastContext || {});
    const currCtxKeys = Object.keys(context || {});

    if (prevCtxKeys.length === currCtxKeys.length) {
      for (const propName of currCtxKeys) {
        if (!prevCtxKeys.includes(propName)) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }

  #shouldViewBeRecreated(
    stringTemplateOutlet: TemplateRef<void> | T,
    stringTemplateOutletContext: ZardStringTemplateOutletContext | undefined,
  ): boolean {
    const isTemplate = isTemplateRef(stringTemplateOutlet);

    const shouldOutletRecreate =
      this.#isFirstChange ||
      isTemplate !== this.#lastOutletWasTemplate ||
      (isTemplate && stringTemplateOutlet !== this.#lastTemplateRef);

    const shouldContextRecreate = this.#hasContextShapeChanged(stringTemplateOutletContext);
    return shouldContextRecreate || shouldOutletRecreate;
  }

  #updateTrackingState(
    stringTemplateOutlet: TemplateRef<void> | T,
    stringTemplateOutletContext: ZardStringTemplateOutletContext | undefined,
  ): void {
    const isTemplate = isTemplateRef(stringTemplateOutlet);
    if (this.#isFirstChange && !isTemplate) {
      this.#isFirstChange = false;
    }

    if (stringTemplateOutletContext !== undefined) {
      this.#lastContext = stringTemplateOutletContext;
    }

    this.#lastOutletWasTemplate = isTemplate;
    this.#lastTemplateRef = isTemplate ? stringTemplateOutlet : null;
  }

  readonly #viewEffect: EffectRef = effect(() => {
    const stringTemplateOutlet = this.zStringTemplateOutlet();
    const stringTemplateOutletContext = this.zStringTemplateOutletContext();

    if (!this.#isFirstChange && isTemplateRef(stringTemplateOutlet)) {
      this.#isFirstChange = true;
    }

    if (!isTemplateRef(stringTemplateOutlet)) {
      this.context['$implicit'] = stringTemplateOutlet as T;
    }

    const recreateView = this.#shouldViewBeRecreated(stringTemplateOutlet, stringTemplateOutletContext);
    this.#updateTrackingState(stringTemplateOutlet, stringTemplateOutletContext);

    if (recreateView) {
      this.#recreateView(
        stringTemplateOutlet as TemplateRef<ZardStringTemplateOutletContext>,
        stringTemplateOutletContext,
      );
    } else {
      this.#updateContext(stringTemplateOutlet, stringTemplateOutletContext);
    }
  });

  #recreateView(
    outlet: TemplateRef<ZardStringTemplateOutletContext>,
    context: ZardStringTemplateOutletContext | undefined,
  ): void {
    this.viewContainer.clear();
    if (isTemplateRef(outlet)) {
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(outlet, context);
    } else {
      this.embeddedViewRef = this.viewContainer.createEmbeddedView(this.templateRef, this.context);
    }
  }

  #updateContext(outlet: TemplateRef<void> | T, context: ZardStringTemplateOutletContext | undefined): void {
    const newCtx = isTemplateRef(outlet) ? context : this.context;
    let oldCtx = this.embeddedViewRef?.context;

    if (!oldCtx) {
      oldCtx = newCtx;
    } else if (newCtx && typeof newCtx === 'object') {
      for (const propName of Object.keys(newCtx)) {
        oldCtx[propName] = newCtx[propName];
      }
    }
    this.#lastContext = oldCtx;
  }

  static ngTemplateContextGuard<T>(
    _dir: ZardStringTemplateOutletDirective<T>,
    _ctx: unknown,
  ): _ctx is ZardStringTemplateOutletContext {
    return true;
  }

  ngOnDestroy(): void {
    this.#viewEffect.destroy();
    this.viewContainer.clear();
    this.embeddedViewRef = null;
  }
}
```

**id.directive.ts**

````
import { computed, Directive, inject, Injectable, input } from '@angular/core';

@Injectable({ providedIn: 'root' })
class ZardIdInternalService {
  private counter = 0;

  /** The next sequence number. Unique for the lifetime of the injector. */
  next(): number {
    return ++this.counter;
  }
}

/**
 * Gives an element a unique id, so `for`/`aria-labelledby` pairs can be wired up
 * inside a component without asking the consumer for one.
 *
 * ```html
 * <span zardId="checkbox" #z="zardId"></span>
 * <input [id]="z.id()" />
 * <label [for]="z.id()">…</label>
 * ```
 */
@Directive({
  selector: '[zardId]',
  exportAs: 'zardId',
})
export class ZardIdDirective {
  /**
   * Claimed once, when the directive is constructed.
   *
   * The id used to be produced by a `computed()` that incremented the counter in
   * its body — a side effect inside a primitive Angular is free to re-evaluate.
   * Each re-evaluation handed back a different id while the rendered DOM still
   * carried the old one, silently breaking the `for`/`id` pair.
   */
  private readonly sequence = inject(ZardIdInternalService).next();

  /** Prefix for the generated id, so ids read as `checkbox-3` rather than `3`. */
  readonly zardId = input('ssr');

  /** `<prefix>-<n>`, with `n` fixed for the life of the directive. */
  readonly id = computed(() => `${this.zardId()}-${this.sequence}`);
}
````

### Add the overlay stack

Create src/app/shared/core/overlay/ with:

**overlay-ref.ts**

```
import type { OverlayRef } from '@angular/cdk/overlay';
import { isPlatformBrowser } from '@angular/common';
import { EventEmitter, signal } from '@angular/core';
import { outputToObservable } from '@angular/core/rxjs-interop';

import { filter, takeUntil, type Observable } from 'rxjs';

import { isTopmostOverlay, popOverlay, pushOverlay } from './overlay-stack';

/** The keys that dismiss the topmost overlay. `Esc` is the legacy IE/Edge spelling. */
const ESCAPE_KEYS = ['Escape', 'Esc'] as const;

/** Which of the two footer buttons fired. */
export const enum ZardOverlayTrigger {
  CANCEL = 'cancel',
  OK = 'ok',
}

/**
 * A callback the consumer passes for the OK / cancel buttons.
 *
 * Returning `false` keeps the overlay open — which is how a form stays up when
 * validation fails.
 */
export type ZardOverlayCallback<T> = ((instance: T) => false | void | object) | EventEmitter<T> | undefined;

/** The subset of an overlay's options this base class reads. */
export interface ZardOverlayRefOptions<T> {
  zDuration?: number;
  zOnOk?: ZardOverlayCallback<T>;
  zOnCancel?: ZardOverlayCallback<T>;
}

/**
 * The lifecycle every service-opened overlay shares.
 *
 * Dialog, sheet, alert-dialog and drawer each had their own copy of this: the
 * same signals, the same Escape wiring, the same dispose-once timer. The copies
 * drifted — one kept no stack, another swallowed dispose errors — so the parts
 * that are genuinely per-overlay are now the only things a subclass writes:
 *
 *   {@link defaultDuration}   how long the leave animation lasts
 *   {@link playLeaveAnimation} what marks the container as leaving
 *   {@link closesOnOutsidePointer} whether a press outside dismisses
 *
 * Subclasses call {@link attach} at the end of their constructor, once their own
 * fields are initialized.
 */
export abstract class ZardOverlayRefBase<T = unknown, R = unknown> {
  /** Element focused before the overlay opened, used to restore focus on close. */
  private readonly previouslyFocusedElement: HTMLElement | null;

  /** Pending dispose timer; cleared if dispose runs early or twice. */
  private disposeTimer: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;

  private readonly _isClosing = signal(false);
  private readonly _result = signal<R | undefined>(undefined);
  private readonly _componentInstance = signal<T | null>(null);

  /** True from the moment {@link close} is called until the overlay is disposed. */
  readonly isClosing = this._isClosing.asReadonly();
  /** Result passed to {@link close}, available after it's called. */
  readonly result = this._result.asReadonly();
  /** Instance of the component projected as content, or null for templates / strings. */
  readonly componentInstance = this._componentInstance.asReadonly();

  protected constructor(
    protected readonly overlayRef: OverlayRef | null,
    private readonly overlayOptions: ZardOverlayRefOptions<T>,
    private readonly platformId: object,
  ) {
    this.previouslyFocusedElement = isPlatformBrowser(platformId)
      ? (document.activeElement as HTMLElement | null)
      : null;
  }

  /** How long the leave animation runs when `zDuration` is not given. */
  protected abstract get defaultDuration(): number;

  /** Marks the container as leaving, so the CSS transition can run before dispose. */
  protected abstract playLeaveAnimation(): void;

  /** Whether a press outside the overlay should dismiss it. */
  protected closesOnOutsidePointer(): boolean {
    return true;
  }

  /** Whether Escape should dismiss it, on top of being the topmost overlay. */
  protected closesOnEscape(): boolean {
    return true;
  }

  /**
   * Whether what a footer callback returns becomes the overlay's `result`.
   *
   * A confirm dialog answers yes or no, so alert-dialog closes with nothing and
   * keeps `result()` undefined.
   */
  protected forwardsCallbackResult(): boolean {
    return true;
  }

  /**
   * What the footer callbacks receive.
   *
   * The content component's instance, so a form can be read before it closes.
   * Alert-dialog has no content component and hands over its `zData` instead.
   */
  protected callbackArgument(): T {
    return this._componentInstance() as T;
  }

  /**
   * Wires the overlay up and registers it as the topmost one.
   *
   * Called by the subclass rather than by this constructor: the outputs come from
   * the container, and a subclass field holding it is not initialized yet while
   * the base constructor runs.
   */
  protected attach(outputs: { ok: Observable<unknown>; cancel: Observable<unknown> } | null): void {
    if (!this.overlayRef || !outputs) {
      return;
    }

    pushOverlay(this);

    const detached$ = this.overlayRef.detachments();

    // If the overlay is torn down externally (parent destroyed, app shutdown, etc.),
    // make sure stack and focus state are cleaned up.
    detached$.subscribe(() => this.dispose());

    outputs.cancel.pipe(takeUntil(detached$)).subscribe(() => this.trigger(ZardOverlayTrigger.CANCEL));
    outputs.ok.pipe(takeUntil(detached$)).subscribe(() => this.trigger(ZardOverlayTrigger.OK));

    if (this.closesOnOutsidePointer()) {
      this.overlayRef
        .outsidePointerEvents()
        .pipe(takeUntil(detached$))
        .subscribe(() => this.close());
    }

    this.overlayRef
      .keydownEvents()
      .pipe(
        filter(event => ESCAPE_KEYS.includes(event.key as (typeof ESCAPE_KEYS)[number])),
        takeUntil(detached$),
      )
      .subscribe(event => {
        if (isTopmostOverlay(this) && this.closesOnEscape()) {
          event.preventDefault();
          this.close();
        }
      });
  }

  /** Turns a container's two outputs into the shape {@link attach} wants. */
  protected static outputsOf(container: {
    okTriggered: Parameters<typeof outputToObservable>[0];
    cancelTriggered: Parameters<typeof outputToObservable>[0];
  }): { ok: Observable<unknown>; cancel: Observable<unknown> } {
    return {
      ok: outputToObservable(container.okTriggered),
      cancel: outputToObservable(container.cancelTriggered),
    };
  }

  /** Internal: set the component instance once attached. */
  setComponentInstance(instance: T | null): void {
    this._componentInstance.set(instance);
  }

  close(result?: R): void {
    if (this._isClosing()) {
      return;
    }

    this._isClosing.set(true);
    this._result.set(result);

    if (isPlatformBrowser(this.platformId)) {
      this.playLeaveAnimation();
    }

    this.disposeTimer = setTimeout(() => this.dispose(), this.overlayOptions.zDuration ?? this.defaultDuration);
  }

  private dispose(): void {
    if (this.disposed) {
      return;
    }
    this.disposed = true;

    if (this.disposeTimer !== null) {
      clearTimeout(this.disposeTimer);
      this.disposeTimer = null;
    }

    if (this.overlayRef) {
      if (this.overlayRef.hasAttached()) {
        this.overlayRef.detachBackdrop();
      }
      this.overlayRef.dispose();
    }

    popOverlay(this);

    if (isPlatformBrowser(this.platformId) && this.previouslyFocusedElement?.isConnected) {
      this.previouslyFocusedElement.focus();
    }
  }

  private trigger(action: ZardOverlayTrigger): void {
    const callback = action === ZardOverlayTrigger.OK ? this.overlayOptions.zOnOk : this.overlayOptions.zOnCancel;

    if (callback instanceof EventEmitter) {
      callback.emit(this.callbackArgument());
      return;
    }

    if (typeof callback === 'function') {
      const result = callback(this.callbackArgument()) as R | false;
      // `false` keeps the overlay open — a form that failed validation stays up.
      if (result !== false) {
        this.close(this.forwardsCallbackResult() ? (result as R) : undefined);
      }
      return;
    }

    this.close();
  }
}
```

**overlay-stack.ts**

```
/**
 * One stack for every overlay that can be dismissed with Escape.
 *
 * Dialog, sheet and alert-dialog each used to keep their own private static
 * stack, and the drawer kept none. Each type therefore believed it was topmost
 * whenever it was topmost *of its own kind*, so one Escape closed a dialog and
 * the sheet underneath it at the same time, and Escape closed every open drawer
 * at once. They share this stack now, so "topmost" means what it says.
 *
 * Entries are compared by identity, so the stack holds nothing but the refs
 * themselves and never needs to know their types.
 */
const stack: object[] = [];

/** Registers a newly opened overlay as the topmost one. */
export function pushOverlay(ref: object): void {
  if (!stack.includes(ref)) {
    stack.push(ref);
  }
}

/** Removes an overlay from the stack. Safe to call more than once. */
export function popOverlay(ref: object): void {
  const index = stack.indexOf(ref);
  if (index >= 0) {
    stack.splice(index, 1);
  }
}

/** Whether `ref` is the overlay Escape should act on. */
export function isTopmostOverlay(ref: object): boolean {
  return stack.length > 0 && stack[stack.length - 1] === ref;
}

/** How many overlays are open. Exposed for tests. */
export function openOverlayCount(): number {
  return stack.length;
}
```

### Add the i18n service

Create src/app/shared/core/i18n/ with:

**i18n.constants.ts**

```
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

**i18n.provider.ts**

```
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

**i18n.service.ts**

```
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

**i18n.tokens.ts**

```
import { InjectionToken } from '@angular/core';

import type { ZardI18nInterface } from './i18n.types';

export const ZARD_LOCALE = new InjectionToken<string>('ZARD_LOCALE');
export const ZARD_I18N = new InjectionToken<ZardI18nInterface>('ZARD_I18N');
```

**i18n.types.ts**

```
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

**index.ts**

```
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

### Add the i18n locales

Create src/app/shared/core/i18n/locales/ with:

**de-de.ts**

```
import type { ZardI18nInterface } from '../i18n.types';

export const de_DE: ZardI18nInterface = {
  locale: 'de-DE',
  calendar: {
    weekStartsOn: 1,
    labels: {
      today: 'Heute',
      nextMonth: 'Nächster Monat',
      previousMonth: 'Vorheriger Monat',
      nextYear: 'Nächstes Jahr',
      previousYear: 'Vorheriges Jahr',
      chooseMonth: 'Monat auswählen',
      chooseYear: 'Jahr auswählen',
      selected: 'Ausgewählt',
      rangeStart: 'Bereichsbeginn',
      rangeEnd: 'Bereichsende',
      inRange: 'Im Bereich',
      outsideMonth: 'Außerhalb des Monats',
      disabled: 'Deaktiviert',
    },
  },
};
```

**en-us.ts**

```
import { DEFAULT_CALENDAR_I18N } from '../i18n.constants';
import type { ZardI18nInterface } from '../i18n.types';

export const en_US: ZardI18nInterface = {
  locale: 'en-US',
  calendar: DEFAULT_CALENDAR_I18N,
};
```

**es-es.ts**

```
import type { ZardI18nInterface } from '../i18n.types';

export const es_ES: ZardI18nInterface = {
  locale: 'es-ES',
  calendar: {
    weekStartsOn: 1,
    labels: {
      today: 'Hoy',
      nextMonth: 'Mes siguiente',
      previousMonth: 'Mes anterior',
      nextYear: 'Año siguiente',
      previousYear: 'Año anterior',
      chooseMonth: 'Elegir el mes',
      chooseYear: 'Elegir el año',
      selected: 'Seleccionado',
      rangeStart: 'Inicio de rango',
      rangeEnd: 'Fin de rango',
      inRange: 'En rango',
      outsideMonth: 'Fuera de mes',
      disabled: 'Deshabilitado',
    },
  },
};
```

**fr-fr.ts**

```
import type { ZardI18nInterface } from '../i18n.types';

export const fr_FR: ZardI18nInterface = {
  locale: 'fr-FR',
  calendar: {
    weekStartsOn: 1,
    labels: {
      today: "Aujourd'hui",
      nextMonth: 'Mois suivant',
      previousMonth: 'Mois précédent',
      nextYear: 'Année suivante',
      previousYear: 'Année précédente',
      chooseMonth: 'Choisir le mois',
      chooseYear: "Choisir l'année",
      selected: 'Sélectionné',
      rangeStart: 'Début de plage',
      rangeEnd: 'Fin de plage',
      inRange: 'Dans la plage',
      outsideMonth: 'Hors du mois',
      disabled: 'Désactivé',
    },
  },
};
```

**it-it.ts**

```
import type { ZardI18nInterface } from '../i18n.types';

export const it_IT: ZardI18nInterface = {
  locale: 'it-IT',
  calendar: {
    weekStartsOn: 1,
    labels: {
      today: 'Oggi',
      nextMonth: 'Mese successivo',
      previousMonth: 'Mese precedente',
      nextYear: 'Anno successivo',
      previousYear: 'Anno precedente',
      chooseMonth: 'Scegli il mese',
      chooseYear: "Scegli l'anno",
      selected: 'Selezionato',
      rangeStart: 'Inizio intervallo',
      rangeEnd: 'Fine intervallo',
      inRange: "Nell'intervallo",
      outsideMonth: 'Fuori mese',
      disabled: 'Disabilitato',
    },
  },
};
```

**pt-br.ts**

```
import type { ZardI18nInterface } from '../i18n.types';

export const pt_BR: ZardI18nInterface = {
  locale: 'pt-BR',
  calendar: {
    weekStartsOn: 0,
    labels: {
      today: 'Hoje',
      nextMonth: 'Próximo mês',
      previousMonth: 'Mês anterior',
      nextYear: 'Próximo ano',
      previousYear: 'Ano anterior',
      chooseMonth: 'Escolher mês',
      chooseYear: 'Escolher ano',
      selected: 'Selecionado',
      rangeStart: 'Início do intervalo',
      rangeEnd: 'Fim do intervalo',
      inRange: 'No intervalo',
      outsideMonth: 'Fora do mês',
      disabled: 'Desativado',
    },
  },
};
```

**pt-pt.ts**

```
import type { ZardI18nInterface } from '../i18n.types';

export const pt_PT: ZardI18nInterface = {
  locale: 'pt-PT',
  calendar: {
    weekStartsOn: 1,
    labels: {
      today: 'Hoje',
      nextMonth: 'Mês seguinte',
      previousMonth: 'Mês anterior',
      nextYear: 'Ano seguinte',
      previousYear: 'Ano anterior',
      chooseMonth: 'Escolher mês',
      chooseYear: 'Escolher ano',
      selected: 'Selecionado',
      rangeStart: 'Início do intervalo',
      rangeEnd: 'Fim do intervalo',
      inRange: 'No intervalo',
      outsideMonth: 'Fora do mês',
      disabled: 'Desativado',
    },
  },
};
```

**registry.ts**

```
import type { ZardI18nInterface } from '../i18n.types';
import { de_DE } from './de-de';
import { en_US } from './en-us';
import { es_ES } from './es-es';
import { fr_FR } from './fr-fr';
import { it_IT } from './it-it';
import { pt_BR } from './pt-br';
import { pt_PT } from './pt-pt';

export const STANDARD_LOCALES: Record<string, ZardI18nInterface> = {
  'en-US': en_US,
  en: en_US,
  'fr-FR': fr_FR,
  fr: fr_FR,
  'es-ES': es_ES,
  es: es_ES,
  'de-DE': de_DE,
  de: de_DE,
  'it-IT': it_IT,
  it: it_IT,
  'pt-BR': pt_BR,
  'pt-PT': pt_PT,
  pt: pt_BR,
};

export function getPresetLocale(locale: string): ZardI18nInterface | undefined {
  if (!locale) {
    return undefined;
  }
  return (
    STANDARD_LOCALES[locale] ??
    STANDARD_LOCALES[locale.toLowerCase()] ??
    STANDARD_LOCALES[locale.split(/[-_]/)[0].toLowerCase()]
  );
}
```

### Add the event manager plugins

Create src/app/shared/core/provider/event-manager-plugins/ with:

**zard-debounce-event-manager-plugin.ts**

```
import type { ListenerOptions } from '@angular/core';
import { EventManagerPlugin } from '@angular/platform-browser';

export class ZardDebounceEventManagerPlugin extends EventManagerPlugin {
  override supports(eventName: string): boolean {
    return /\.debounce(?:\.|$)/.test(eventName);
  }

  override addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: (event: Event) => void,
    options?: ListenerOptions,
    // eslint-disable-next-line
  ): Function {
    // Expected format: "event.debounce.delay" (e.g., "input.debounce.150")
    // If delay is omitted or invalid, defaults to 300ms
    const [event, , delay] = eventName.split('.');
    const parsedDelay = Number.parseInt(delay);
    const resolvedDelay = Number.isNaN(parsedDelay) ? 300 : parsedDelay;

    let timeoutId!: ReturnType<typeof setTimeout>;
    const listener = (event: Event) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => handler(event), resolvedDelay);
    };
    const unsubscribe = this.manager.addEventListener(element, event, listener, options);
    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }
}
```

**zard-event-manager-plugin.ts**

```
import type { ListenerOptions } from '@angular/core';
import { EventManagerPlugin } from '@angular/platform-browser';

/**
 * Angular EventManagerPlugin that provides event modifier syntax for templates.
 *
 * Supports modifiers: .prevent, .stop, .stop-immediate, .prevent-with-stop
 * Supports key filters: enter, escape, {enter,space}
 *
 * @example
 * Prevent default on any click
 * (click.prevent)="handler()"
 *
 * @example
 * Prevent default only on Enter key
 * (keydown.enter.prevent)="handler()"
 *
 * @example
 * Prevent default on more keys like Enter and Space key
 * (keydown.{enter,space}.prevent)="handler()"
 *
 * @example
 * Stop propagation
 * (click.stop)="handler()"
 */
export class ZardEventManagerPlugin extends EventManagerPlugin {
  #keywords = ['prevent', 'stop', 'stop-immediate', 'prevent-with-stop'];

  override supports(eventName: string): boolean {
    return this.#keywords.some(keyword => eventName.endsWith(`.${keyword}`));
  }

  override addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: (event: Event) => void,
    options?: ListenerOptions,
    // eslint-disable-next-line
  ): Function {
    const { event, keyword, keys } = this.#provideEventFrom(eventName, this.#keywords);
    return this.manager.addEventListener(
      element,
      event,
      (event: Event) => {
        const isKeyboardEvent = event instanceof KeyboardEvent;
        const isElementDisabled = element.getAttribute('aria-disabled') === 'true';
        const shouldApplyModifier =
          (!keys.length || (isKeyboardEvent && keys.includes(event.key.toLowerCase()))) && !isElementDisabled;

        if (shouldApplyModifier) {
          switch (keyword) {
            case 'stop':
              event.stopPropagation();
              break;
            case 'stop-immediate':
              event.stopImmediatePropagation();
              break;
            case 'prevent-with-stop':
              event.preventDefault();
              event.stopPropagation();
              break;
            default:
              event.preventDefault();
              break;
          }
        }
        handler(event);
      },
      options,
    );
  }

  #provideEventFrom(eventName: string, keywords: string[]): { event: string; keyword: string; keys: string[] } {
    const eventNameSubstrings = eventName.split('.');
    let event = '';
    let keys: string[] = [];
    let keyword = '';

    for (const substring of eventNameSubstrings) {
      if (substring.startsWith('{')) {
        keys = this.#extractKeys(substring);
        continue;
      } else if (keywords.includes(substring)) {
        keyword = substring;
        break;
      } else if (!event) {
        event = substring;
      } else {
        event += `.${substring}`;
      }
    }

    return { event, keyword, keys };
  }

  #extractKeys(substring: string): string[] {
    const stringList = substring.substring(1, substring.length - 1);
    return stringList
      .split(',')
      .map(raw => {
        const s = raw.toLowerCase().trim();
        return s === 'space' ? ' ' : s;
      })
      .filter(Boolean);
  }
}
```

### Add the zard/ui provider

Create src/app/shared/core/provider/ with:

**providezard.ts**

```
import { makeEnvironmentProviders, type EnvironmentProviders } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { ZardDebounceEventManagerPlugin } from './event-manager-plugins/zard-debounce-event-manager-plugin';
import { ZardEventManagerPlugin } from './event-manager-plugins/zard-event-manager-plugin';

export function provideZard(): EnvironmentProviders {
  const eventManagerPlugins = [
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: ZardEventManagerPlugin,
      multi: true,
    },
    {
      provide: EVENT_MANAGER_PLUGINS,
      useClass: ZardDebounceEventManagerPlugin,
      multi: true,
    },
  ];

  return makeEnvironmentProviders([...eventManagerPlugins]);
}
```

### Add the core styles

Create src/app/shared/core/css/ with:

**zard.css**

```
/*
 * `no-scrollbar` lives here, not in utilities.css, because combobox and command
 * carry it in their variants — it has to ship with every install, while
 * utilities.css is opt-in.
 */
@utility no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

/*
 * `scrollbar-thin` is opt-in, for the same reason `no-scrollbar` lives here rather
 * than in `utilities.css`: it has to be available to every install, not layered on
 * top as an extra registry item.
 *
 * It used to ship differently — a CLI constant literally named `windowsScrollbar`
 * wrote a bare, unscoped `::-webkit-scrollbar` rule into every project's global
 * stylesheet, restyling every scroll surface in the host app (not just zard's),
 * and repainting them on any `--muted` / `--muted-foreground` change. That constant
 * is gone; this utility is the scoped replacement a consumer applies deliberately.
 *
 * `scrollbar-width` / `scrollbar-color` are the standard CSS properties and the
 * primary mechanism here — Firefox and current Chromium/Edge honor them directly,
 * so the thin, token-colored scrollbar renders without any WebKit-specific rule.
 * The `&::-webkit-scrollbar*` rules are a scoped fallback for WebKit engines that
 * still ignore `scrollbar-color` (older Safari); they never apply outside this
 * class.
 */
@utility scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: var(--muted-foreground) var(--muted);

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--muted-foreground);
    border-radius: 5px;
  }

  &::-webkit-scrollbar-track {
    border-radius: 5px;
    background: var(--muted);
  }
}

@theme inline {
  --animate-caret-blink: caret-blink 1s ease-out infinite;

  @keyframes caret-blink {
    0%,
    70%,
    100% {
      opacity: 1;
    }
    20%,
    50% {
      opacity: 0;
    }
  }

  @keyframes accordion-down {
    from {
      height: 0;
    }
    to {
      height: var(--radix-accordion-content-height, var(--accordion-panel-height, auto));
    }
  }

  @keyframes accordion-up {
    from {
      height: var(--radix-accordion-content-height, var(--accordion-panel-height, auto));
    }
    to {
      height: 0;
    }
  }
}

/* Custom variants */
@custom-variant data-open {
  &:where([data-state='open']),
  &:where([data-open]:not([data-open='false'])) {
    @slot;
  }
}

@custom-variant data-closed {
  &:where([data-state='closed']),
  &:where([data-closed]:not([data-closed='false'])) {
    @slot;
  }
}

@custom-variant data-checked {
  &:where([data-state='checked']),
  &:where([data-checked]:not([data-checked='false'])) {
    @slot;
  }
}

@custom-variant data-unchecked {
  &:where([data-state='unchecked']),
  &:where([data-unchecked]:not([data-unchecked='false'])) {
    @slot;
  }
}

@custom-variant data-selected {
  &:where([data-selected]:not([data-selected='false'])) {
    @slot;
  }
}

@custom-variant data-disabled {
  &:where([data-disabled='true']),
  &:where([data-disabled]:not([data-disabled='false'])) {
    @slot;
  }
}

@custom-variant data-active {
  &:where([data-state='active']),
  &:where([data-active]:not([data-active='false'])) {
    @slot;
  }
}

@custom-variant data-horizontal {
  &:where([data-orientation='horizontal']) {
    @slot;
  }
}

@custom-variant data-vertical {
  &:where([data-orientation='vertical']) {
    @slot;
  }
}
```

### Add the core barrel

Create src/app/shared/core/index.ts with:

**index.ts**

```
export * from './directives/string-template-outlet.directive';
export * from './directives/id.directive';
export * from './overlay/overlay-ref';
export * from './overlay/overlay-stack';
export * from './provider/providezard';
export * from './provider/event-manager-plugins/zard-debounce-event-manager-plugin';
export * from './provider/event-manager-plugins/zard-event-manager-plugin';
```

### Add a lib helper

Create a utils folder at src/app/shared/utils with:

**index.ts**

```
export * from './merge-classes';
export * from './noop';
export * from './number';
```

**merge-classes.ts**

```
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type { ClassValue };

/** Merges CVA variants with a consumer's `class` input, last write winning. */
export function mergeClasses(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

**noop.ts**

```
/** Does nothing. Used as the initial value of a ControlValueAccessor callback. */
export const noopFn = (): void => void 0;
```

**number.ts**

```
function clamp(value: number, [min, max]: [number, number]): number {
  return Math.min(max, Math.max(min, value));
}

function roundToStep(value: number, min: number, step: number): number {
  return Math.round((value - min) / step) * step + min;
}

function convertValueToPercentage(value: number, min: number, max: number): number {
  return ((value - min) / (max - min)) * 100;
}

export { clamp, roundToStep, convertValueToPercentage };
```

### Configure styles

Add the following to src/styles.css. You can learn more about using CSS variables for theming in the [theming section.](/docs/theming)

**styles.css**

```
@layer ng-icon, theme, base, components, utilities;
@import 'tailwindcss';
@import './app/shared/core/css/zard';
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --destructive-foreground: oklch(0.985 0 0);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: oklch(0.205 0 0);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --destructive-foreground: oklch(0.205 0 0);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
  --chart-1: oklch(0.809 0.105 251.813);
  --chart-2: oklch(0.623 0.214 259.815);
  --chart-3: oklch(0.546 0.245 262.881);
  --chart-4: oklch(0.488 0.243 264.376);
  --chart-5: oklch(0.424 0.199 265.638);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.556 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) * 0.6);
  --radius-md: calc(var(--radius) * 0.8);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) * 1.4);
  --radius-2xl: calc(var(--radius) * 1.8);
  --radius-3xl: calc(var(--radius) * 2.2);
  --radius-4xl: calc(var(--radius) * 2.6);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }

  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
    appearance: textfield; /* Added for general compatibility */
  }
}
```

### Register the providers

Add provideZard() to the providers of your src/app/app.config.ts

**app.config.ts**

```
import { ApplicationConfig } from '@angular/core';

import { provideZard } from '@/shared/core/provider/providezard';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZard(),
  ],
};
```

### Create a components.json file

Create a components.json file in the root of your workspace.

**components.json**

```
{
  "$schema": "https://zardui.com/schema.json",
  "style": "css",
  "icons": "lucide",
  "rtl": false,
  "projectType": "analog",
  "appConfigFile": "src/app/app.config.ts",
  "packageManager": "npm",
  "tailwind": {
    "css": "src/styles.css",
    "baseColor": "neutral"
  },
  "baseUrl": "src/app",
  "aliases": {
    "components": "@/shared/components",
    "utils": "@/shared/utils",
    "core": "@/shared/core",
    "services": "@/shared/services"
  }
}
```

### That's it

You can now start adding components to your project.
