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

/**
 * The pointer half of the roving focus, the way Radix menus do it: the row under the pointer takes
 * the focus, so the pointer and the keyboard share a single highlight, and leaving a row hands the
 * focus back to the menu surface, so no row stays lit once the pointer has gone. A sub-trigger whose
 * submenu is open keeps it — the pointer is on its way into that submenu.
 *
 * `onHighlight` receives the row's index among `getMenuItems(surface)`, or `-1` when the pointer
 * left, so the caller keeps its own focused index in step with what is on screen.
 */
export function bindMenuPointer(surface: HTMLElement, onHighlight: (index: number) => void): () => void {
  const rowOf = (target: EventTarget | null): HTMLElement | null => {
    const row = target instanceof Element ? target.closest<HTMLElement>(ZARD_MENU_ITEM_SELECTOR) : null;
    return row && surface.contains(row) ? row : null;
  };

  const onPointerMove = (event: PointerEvent) => {
    const row = rowOf(event.target);
    if (!row || row.dataset['disabled'] !== undefined || row.ownerDocument.activeElement === row) {
      return;
    }

    const index = getMenuItems(surface).indexOf(row);
    if (index !== -1) {
      onHighlight(index);
    }
  };

  const onPointerOut = (event: PointerEvent) => {
    const row = rowOf(event.target);
    if (!row || row.contains(event.relatedTarget as Node | null) || row.getAttribute('aria-expanded') === 'true') {
      return;
    }

    delete row.dataset['highlighted'];
    if (row.ownerDocument.activeElement === row) {
      surface.focus({ preventScroll: true });
    }
    onHighlight(-1);
  };

  surface.addEventListener('pointermove', onPointerMove);
  surface.addEventListener('pointerout', onPointerOut);

  return () => {
    surface.removeEventListener('pointermove', onPointerMove);
    surface.removeEventListener('pointerout', onPointerOut);
  };
}
