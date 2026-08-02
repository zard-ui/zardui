/** Ready-made `zPattern` values, mirroring the ones shipped by the `input-otp` library. */
export const REGEXP_ONLY_DIGITS = '[0-9]';
export const REGEXP_ONLY_CHARS = '[a-zA-Z]';
export const REGEXP_ONLY_DIGITS_AND_CHARS = '[a-zA-Z0-9]';

export function isInputElement(target: EventTarget | null): target is HTMLInputElement {
  return target instanceof HTMLInputElement;
}

export function isInputEvent(event: Event): event is InputEvent {
  return event instanceof InputEvent;
}
