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
