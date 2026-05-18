import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  DOCUMENT,
  inject,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterModule, Scroll } from '@angular/router';

import { inject as injectAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { filter } from 'rxjs';

import { FooterComponent } from '@doc/domain/components/footer/footer.component';
import { HeaderComponent } from '@doc/domain/components/header/header.component';
import { getHeaderOffset } from '@doc/domain/directives/scroll-spy.directive';

const LOADING_TIMEOUT = 1000;
const PREVIEW_URL_PREFIX = '/blocks/preview/';

@Component({
  imports: [RouterModule, HeaderComponent, FooterComponent],
  selector: 'z-root',
  template: `
    @if (!isPreviewRoute()) {
      <z-header></z-header>
    }
    <router-outlet></router-outlet>
    @if (!isPreviewRoute()) {
      <z-footer></z-footer>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);

  private scrollTimeoutId: number | null = null;
  private readonly currentUrl = signal(this.resolveInitialUrl());
  protected readonly isPreviewRoute = computed(() => this.currentUrl().startsWith(PREVIEW_URL_PREFIX));

  private resolveInitialUrl(): string {
    const pathname = this.document.location?.pathname;
    if (pathname) return pathname;
    return this.router.url || '/';
  }

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(e => this.currentUrl.set(e.urlAfterRedirects));

    if (isPlatformBrowser(this.platformId)) {
      injectAnalytics();
      injectSpeedInsights();

      this.destroyRef.onDestroy(() => {
        if (this.scrollTimeoutId !== null) {
          clearTimeout(this.scrollTimeoutId);
          this.scrollTimeoutId = null;
        }
      });

      this.router.events
        .pipe(
          filter((e): e is Scroll => e instanceof Scroll),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(e => {
          if (this.scrollTimeoutId !== null) {
            clearTimeout(this.scrollTimeoutId);
          }

          const timeout = this.router.url.includes('docs/components') ? LOADING_TIMEOUT : 0;
          this.scrollTimeoutId = window.setTimeout(() => {
            if (e.anchor) {
              const anchorElement = this.document.getElementById(e.anchor);
              if (anchorElement) {
                const headerOffset = getHeaderOffset(true);
                const yScrollPosition = anchorElement.offsetTop - headerOffset;
                this.viewportScroller.scrollToPosition([0, Math.max(0, yScrollPosition)]);
              }
            } else {
              this.viewportScroller.scrollToPosition([0, 0]);
            }

            this.scrollTimeoutId = null;
          }, timeout);
        });
    }
  }
}
