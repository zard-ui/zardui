/**
 * Roving focus shared by every menu surface — the overlay the dropdown service owns and the
 * submenu overlay a sub-trigger opens. Both navigate the same primitives, so the item lookup,
 * the `data-highlighted` bookkeeping and the typeahead live here instead of in each of them.
 */

/** Every row of a menu surface that can take focus, in DOM order. */
export const ZARD_MENU_ITEM_SELECTOR = [
  'z-dropdown-menu-item',
  '[z-dropdown-menu-item]',
  'z-dropdown-menu-checkbox-item',
  '[z-dropdown-menu-checkbox-item]',
  'z-dropdown-menu-radio-item',
  '[z-dropdown-menu-radio-item]',
  'z-dropdown-menu-sub-trigger',
  '[z-dropdown-menu-sub-trigger]',
].join(', ');

export function getMenuItems(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(ZARD_MENU_ITEM_SELECTOR)).filter(
    item => item.dataset['disabled'] === undefined,
  );
}

/** Moves the focus to `index` and keeps `data-highlighted` on that row alone. */
export function highlightMenuItem(items: HTMLElement[], index: number): void {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (i === index) {
      item.focus();
      item.dataset['highlighted'] = '';
    } else {
      delete item.dataset['highlighted'];
    }
  }
}

/** Wraps `from` by `direction`, starting at either end when nothing is focused yet. */
export function nextMenuIndex(items: HTMLElement[], from: number, direction: number): number {
  if (items.length === 0) {
    return -1;
  }
  if (from === -1) {
    return direction > 0 ? 0 : items.length - 1;
  }

  const next = from + direction;
  if (next < 0) {
    return items.length - 1;
  }
  if (next >= items.length) {
    return 0;
  }
  return next;
}

/**
 * Typeahead: the next row whose label starts with `char`, searched forward from the focused one
 * so repeated presses cycle through the matches instead of sticking to the first.
 */
export function findMenuItemByChar(items: HTMLElement[], char: string, from: number): number {
  const needle = char.toLowerCase();

  for (let step = 1; step <= items.length; step++) {
    const index = (Math.max(from, -1) + step) % items.length;
    if (items[index].textContent?.trim().toLowerCase().startsWith(needle)) {
      return index;
    }
  }

  return -1;
}

/** True for a key that should drive typeahead rather than an action. */
export function isTypeaheadKey(event: KeyboardEvent): boolean {
  return event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey;
}
