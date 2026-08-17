import { isPlatformBrowser } from '@angular/common';
import { assertInInjectionContext, DestroyRef, inject, PLATFORM_ID, signal, type Signal } from '@angular/core';

const MOBILE_QUERY = '(max-width: 767px)';

/**
 * Tracks whether the viewport is phone-sized, so a demo can pick between a bottom sheet
 * and a side panel. Demo-local on purpose — the drawer itself takes no breakpoint prop.
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
