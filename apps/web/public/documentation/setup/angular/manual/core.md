```typescript title="core/diretives/string-template-outlet/string-template-outlet.directive.ts" expandable="true" copyButton showLineNumbers
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

```typescript title="core/provider/event-manager-plugins/zard-debounce-event-manager-plugin.ts" expandable="true" copyButton showLineNumbers
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

```typescript title="core/provider/event-manager-plugins/zard-event-manager-plugin.ts" expandable="true" copyButton showLineNumbers
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

```typescript title="core/provider/providezard.ts" expandable="true" copyButton showLineNumbers
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
