import { isPlatformBrowser } from '@angular/common';
import { assertInInjectionContext, DestroyRef, inject, PLATFORM_ID, signal, type Signal } from '@angular/core';

/** Phone-sized: the narrowest of the two bands below, kept for whoever needs the device itself. */
const MOBILE_QUERY = '(max-width: 767px)';

/**
 * The width below which the customizer is a strip under the preview, not a
 * column beside it — `lg` (1024px), not `md` (768px). A 768–1023px laptop
 * gets the same full-width strip a phone gets, instead of the column
 * squeezed to 192px that used to run all the way from `md`.
 */
const COMPACT_QUERY = '(max-width: 1023px)';

/**
 * Whether the viewport is phone-sized.
 *
 * Kept distinct from {@link injectIsCompact}: this is a device-width query, not
 * the builder's layout boundary, and the two used to be the same number by
 * coincidence, not by rule. Nothing in the builder consumes this today — it
 * stays exported for whichever future control genuinely needs "is this a
 * phone" rather than "is the customizer a strip."
 *
 * Renders as `false` on the server, so the prerendered markup is the desktop
 * one — the same choice the drawer's own demo makes.
 */
export function injectIsMobile(): Signal<boolean> {
  assertInInjectionContext(injectIsMobile);

  return injectMediaQuery(MOBILE_QUERY);
}

/**
 * Whether the customizer is currently the strip, not the column.
 *
 * The builder needs this in TypeScript, not only in CSS: the option lists open
 * to the right of a column and upwards from a strip, and the code panel sheet
 * is a side sheet next to a column and a bottom sheet under a strip. A media
 * query alone cannot decide either of those — the component has to ask.
 *
 * A sibling of {@link injectIsMobile} rather than a widened version of it: the
 * two answer different questions, and overloading one boolean with a new
 * threshold would have silently changed what every existing caller of
 * `injectIsMobile()` meant without them asking for it.
 *
 * Renders as `false` on the server, so the prerendered markup is the column —
 * the same choice {@link injectIsMobile} makes.
 */
export function injectIsCompact(): Signal<boolean> {
  assertInInjectionContext(injectIsCompact);

  return injectMediaQuery(COMPACT_QUERY);
}

function injectMediaQuery(query: string): Signal<boolean> {
  const matches = signal(false);
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return matches.asReadonly();

  const media = window.matchMedia(query);
  const sync = () => matches.set(media.matches);

  sync();
  media.addEventListener('change', sync);
  inject(DestroyRef).onDestroy(() => media.removeEventListener('change', sync));

  return matches.asReadonly();
}
