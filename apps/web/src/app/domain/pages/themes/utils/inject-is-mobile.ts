import { isPlatformBrowser } from '@angular/common';
import { assertInInjectionContext, DestroyRef, inject, PLATFORM_ID, signal, type Signal } from '@angular/core';

/**
 * The width below which the customizer lives in a drawer instead of the sidebar
 * column — `lg` (1024px), the same boundary the typeset builder settled on for its
 * own strip-vs-column split (see `typeset/utils/inject-is-mobile.ts`). A sibling
 * rather than a shared import: the typeset threshold is justified there by that
 * page's own column width (192px, too cramped between `md` and `lg`); the theme
 * sidebar is 320px and stays usable down to `md`, but keeping one boundary for
 * both of the site's builders is worth more than the few extra pixels a `md` split
 * would have bought here.
 */
const COMPACT_QUERY = '(max-width: 1023px)';

/**
 * Whether the customizer is currently a drawer rather than the column.
 *
 * The `aside`/trigger visibility itself is plain CSS (`lg:block` / `lg:hidden`) —
 * this hook exists for the one thing CSS cannot decide: which edge the drawer
 * opens from. A phone gets a bottom sheet; a tablet in the 768–1023px band gets a
 * side sheet, the same distinction the typeset builder makes for its code panel.
 *
 * Renders as `false` on the server, so the prerendered markup matches the desktop
 * column — the same choice `injectIsMobile` makes in the typeset and drawer demo
 * variants of this hook.
 */
export function injectIsCompact(): Signal<boolean> {
  assertInInjectionContext(injectIsCompact);

  const isCompact = signal(false);
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return isCompact.asReadonly();
  }

  const media = window.matchMedia(COMPACT_QUERY);
  const sync = () => isCompact.set(media.matches);

  sync();
  media.addEventListener('change', sync);
  inject(DestroyRef).onDestroy(() => media.removeEventListener('change', sync));

  return isCompact.asReadonly();
}
