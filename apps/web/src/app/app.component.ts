import { isPlatformBrowser, ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, DOCUMENT, inject, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule, Scroll } from '@angular/router';

import { filter } from 'rxjs';

import { HeaderOffset } from '@doc/domain/directives/scroll-spy.directive';

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

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.router.events
        .pipe(
          filter((e): e is Scroll => e instanceof Scroll),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(e => {
          const timeout = this.router.url.includes('docs/components') ? LOADING_TIMEOUT : 0;
          setTimeout(() => {
            if (e.anchor) {
              const anchorElement = this.document.getElementById(e.anchor);
              if (anchorElement) {
                const yScrollPosition = anchorElement.offsetTop - HeaderOffset;
                this.viewportScroller.scrollToPosition([0, Math.max(HeaderOffset, yScrollPosition)]);
              }
            } else {
              this.viewportScroller.scrollToPosition([0, 0]);
            }
          }, timeout);
        });
    }
  }
}
