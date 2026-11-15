import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowLeft, lucideArrowRight } from '@ng-icons/lucide';
import { filter, map } from 'rxjs';

import { findDocNeighbours } from '@doc/shared/constants/doc-pager.constant';

import { ZardButtonComponent } from '@zard/components/button/button.component';

/** Previous / next links at the end of a docs page, following the sidebar order (desktop only, as in shadcn/ui). */
@Component({
  selector: 'z-doc-pager',
  imports: [RouterLink, NgIcon, ZardButtonComponent],
  template: `
    @if (neighbours(); as pager) {
      @if (pager.previous || pager.next) {
        <nav aria-label="Docs pages" class="hidden h-16 w-full items-center gap-2 sm:flex">
          @if (pager.previous; as previous) {
            <a z-button zType="secondary" zSize="sm" class="shadow-none" [routerLink]="previous.path">
              <ng-icon name="lucideArrowLeft" aria-hidden="true" />
              {{ previous.name }}
            </a>
          }
          @if (pager.next; as next) {
            <a z-button zType="secondary" zSize="sm" class="ml-auto shadow-none" [routerLink]="next.path">
              {{ next.name }}
              <ng-icon name="lucideArrowRight" aria-hidden="true" />
            </a>
          }
        </nav>
      }
    }
  `,
  viewProviders: [provideIcons({ lucideArrowLeft, lucideArrowRight })],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocPagerComponent {
  private readonly router = inject(Router);

  private readonly url = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly neighbours = computed(() => findDocNeighbours(this.url()));
}
