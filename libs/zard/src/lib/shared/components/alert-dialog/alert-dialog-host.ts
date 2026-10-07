import type { WritableSignal } from '@angular/core';

let uid = 0;

/** Unique id for the title/description an alert dialog points its ARIA attributes at. */
export function nextAlertDialogId(suffix: string): string {
  return `z-alert-dialog-${++uid}-${suffix}`;
}

/**
 * Contract shared by the declarative `z-alert-dialog` and the container the service opens,
 * so projected content (`z-alert-dialog-title`, `[z-alert-dialog-close]`, …) works the same in both.
 */
export abstract class ZardAlertDialogHost {
  abstract readonly titleId: WritableSignal<string | null>;
  abstract readonly descriptionId: WritableSignal<string | null>;

  /** Asks the alert dialog to close. */
  abstract requestClose(): void;
}
