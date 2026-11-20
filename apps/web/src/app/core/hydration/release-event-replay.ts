import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  afterEveryRender,
  APP_ID,
  EnvironmentInjector,
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideEnvironmentInitializer,
  ɵJSACTION_BLOCK_ELEMENT_MAP as JSACTION_BLOCK_ELEMENT_MAP,
  type EnvironmentProviders,
} from '@angular/core';

/** What the inline event-replay script of the prerendered HTML keeps in `window._ejsas[appId]`. */
interface EarlyEventData {
  /** The container the early listeners sit on (the `body`). */
  readonly c: EventTarget;
  /** The events that script is listening to: bubbling, then capturing. */
  readonly et: readonly string[];
  readonly etc: readonly string[];
  /** The listener, and the queue it fills with every event until the app takes over. */
  readonly h: EventListener;
  readonly q: unknown[];
}

type EarlyEventWindow = Window & { _ejsas?: Record<string, EarlyEventData | undefined> };

/** Pruning starts once this many elements are tracked, and again each time that many more pile up. */
const PRUNE_STEP = 40;

/**
 * Stops Angular's event replay (`withEventReplay()`) from pinning DOM that is long gone.
 *
 * Two bookkeeping structures grow for as long as the page lives, and every overlay that opens and closes (a popover,
 * a menu, a dialog) leaves its whole tree reachable through them. Each open of a picker kept ~60 detached nodes alive.
 *
 * 1. The early listeners the prerendered HTML installs on `body` keep queueing every click and key event, with its
 *    target, after the app has taken over: Angular forgets the data but never removes the listeners. Once it has
 *    taken over they are redundant, so they are removed here.
 * 2. Every element that gets a listener is recorded in a `Set` kept for replay and incremental hydration, and
 *    never dropped. A disconnected element has nothing left to replay or hydrate, so those are dropped; the pass runs
 *    only when the record has grown by a step since the last one.
 */
export function provideEventReplayRelease(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideEnvironmentInitializer(() => {
      if (!isPlatformBrowser(inject(PLATFORM_ID))) return;

      const win = inject(DOCUMENT).defaultView as EarlyEventWindow | null;
      const appId = inject(APP_ID);
      const map = inject(JSACTION_BLOCK_ELEMENT_MAP) as Map<string, Set<Element>>;

      let early = win?._ejsas?.[appId];
      let threshold = PRUNE_STEP;

      afterEveryRender(
        () => {
          // Angular clears its reference once it owns the events: from then on the early listeners only leak.
          if (early && win?._ejsas?.[appId] !== early) {
            for (const type of early.et) early.c.removeEventListener(type, early.h);
            for (const type of early.etc) early.c.removeEventListener(type, early.h, true);
            early.q.length = 0;
            early = undefined;
          }

          let size = 0;
          for (const elements of map.values()) size += elements.size;
          if (size < threshold) return;

          for (const elements of map.values()) {
            for (const element of elements) {
              if (!element.isConnected) elements.delete(element);
            }
          }

          size = 0;
          for (const elements of map.values()) size += elements.size;
          threshold = size + PRUNE_STEP;
        },
        { injector: inject(EnvironmentInjector) },
      );
    }),
  ]);
}
