import { isPlatformBrowser } from '@angular/common';
import { assertInInjectionContext, DestroyRef, inject, PLATFORM_ID, signal, type Signal } from '@angular/core';

/** The width below which the customizer is a strip under the preview, not a column beside it. */
const MOBILE_QUERY = '(max-width: 767px)';

/**
 * Whether the viewport is phone-sized.
 *
 * The builder needs this in TypeScript, not only in CSS: the option lists open
 * to the right of a column and upwards from a strip, and the code panel is a
 * side sheet on a desktop and a bottom sheet on a phone. A media query cannot
 * decide either of those.
 *
 * Renders as `false` on the server, so the prerendered markup is the desktop
 * one — the same choice the drawer's own demo makes.
 */
export function injectIsMobile(): Signal<boolean> {
  assertInInjectionContext(injectIsMobile);

  const isMobile = signal(false);
  if (!isPlatformBrowser(inject(PLATFORM_ID))) return isMobile.asReadonly();

  const media = window.matchMedia(MOBILE_QUERY);
  const sync = () => isMobile.set(media.matches);

  sync();
  media.addEventListener('change', sync);
  inject(DestroyRef).onDestroy(() => media.removeEventListener('change', sync));

  return isMobile.asReadonly();
}
