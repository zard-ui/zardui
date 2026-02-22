import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, DOCUMENT, inject, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule, Scroll } from '@angular/router';

import { inject as injectAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';
import { filter } from 'rxjs';

import { getHeaderOffset } from '@doc/domain/directives/scroll-spy.directive';

const LOADING_TIMEOUT = 1000;

@Component({
  imports: [RouterModule],
  selector: 'z-root',
  template: `
    <router-outlet></router-outlet>
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

  constructor() {
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
