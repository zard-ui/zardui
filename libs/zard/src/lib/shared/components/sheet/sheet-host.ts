import type { WritableSignal } from '@angular/core';

let uid = 0;

/** Unique id for the title/description a sheet points its ARIA attributes at. */
export function nextSheetId(suffix: string): string {
  return `z-sheet-${++uid}-${suffix}`;
}

/**
 * Contract shared by the declarative `z-sheet` and the container the service opens,
 * so projected content (`z-sheet-title`, `[z-sheet-close]`, …) works the same in both.
 */
export abstract class ZardSheetHost {
  abstract readonly titleId: WritableSignal<string | null>;
  abstract readonly descriptionId: WritableSignal<string | null>;

  /** Asks the sheet to close. */
  abstract requestClose(): void;
}
