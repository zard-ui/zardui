import type { WritableSignal } from '@angular/core';

let uid = 0;

/** Unique id for the title/description a dialog points its ARIA attributes at. */
export function nextDialogId(suffix: string): string {
  return `z-dialog-${++uid}-${suffix}`;
}

/**
 * Contract shared by the declarative `z-dialog` and the container the service opens,
 * so projected content (`z-dialog-title`, `[z-dialog-close]`, …) works the same in both.
 */
export abstract class ZardDialogHost {
  abstract readonly titleId: WritableSignal<string | null>;
  abstract readonly descriptionId: WritableSignal<string | null>;

  /** Asks the dialog to close. */
  abstract requestClose(): void;
}
