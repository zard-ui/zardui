import { computed, signal, type Signal } from '@angular/core';

/** Panels currently on screen, oldest first. */
const panels = signal<readonly object[]>([]);

/** Scale removed from a panel for each drawer stacked on top of it. */
export const DRAWER_STACK_STEP = 0.05;

/** How far a stacked panel peeks out from under the one in front of it. */
export const DRAWER_STACK_PEEK = 16;

export function pushDrawerPanel(panel: object): void {
  panels.update(current => (current.includes(panel) ? current : [...current, panel]));
}

export function popDrawerPanel(panel: object): void {
  panels.update(current => current.filter(entry => entry !== panel));
}

/** True while any drawer is already on screen — a new one opening on top is nested. */
export function hasOpenDrawer(): boolean {
  return panels().length > 0;
}

/** How many drawers are stacked on top of `panel`. 0 means it is the frontmost one. */
export function drawerDepth(panel: object): Signal<number> {
  return computed(() => {
    const current = panels();
    const index = current.indexOf(panel);
    return index === -1 ? 0 : current.length - 1 - index;
  });
}
