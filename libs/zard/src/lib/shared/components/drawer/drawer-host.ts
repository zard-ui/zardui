import type { WritableSignal } from '@angular/core';

let uid = 0;

/** Unique id for the title/description a drawer points its ARIA attributes at. */
export function nextDrawerId(suffix: string): string {
  return `z-drawer-${++uid}-${suffix}`;
}

/**
 * Contract shared by the declarative `z-drawer` and the container the service opens,
 * so projected content (`z-drawer-title`, `[z-drawer-close]`, …) works the same in both.
 */
export abstract class ZardDrawerHost {
  abstract readonly titleId: WritableSignal<string | null>;
  abstract readonly descriptionId: WritableSignal<string | null>;

  /** Asks the drawer to close. Dismissible drawers close, the others stay put. */
  abstract requestClose(): void;
}
