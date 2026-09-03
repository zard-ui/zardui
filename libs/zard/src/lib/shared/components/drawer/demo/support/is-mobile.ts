import { isPlatformBrowser } from '@angular/common';
import { assertInInjectionContext, DestroyRef, inject, PLATFORM_ID, signal, type Signal } from '@angular/core';

const MOBILE_QUERY = '(max-width: 767px)';

/**
 * Tracks whether the viewport is phone-sized, so a demo can pick between a bottom sheet
 * and a side panel. Demo-local on purpose — the drawer itself takes no breakpoint prop.
 *
 * Lives in `demo/support/` rather than directly under `demo/`: the docs generator turns
 * every top-level file in `demo/` into its own code sample, and this one is shared by
 * three demos (`preview`, `nested`, `responsive`) rather than being a demo itself. A
 * subfolder is invisible to that scan, so it never ships as an orphaned, unreferenced
 * example. It is also outside the CLI registry's scan of the component root, so it never
 * ships as an installable drawer file either — it is docs-site-only code.
 */
export function injectIsMobile(): Signal<boolean> {
  assertInInjectionContext(injectIsMobile);

  const isMobile = signal(false);
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return isMobile.asReadonly();
  }

  const media = window.matchMedia(MOBILE_QUERY);
  const sync = () => isMobile.set(media.matches);

  sync();
  media.addEventListener('change', sync);
  inject(DestroyRef).onDestroy(() => media.removeEventListener('change', sync));

  return isMobile.asReadonly();
}
