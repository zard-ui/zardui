import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';

import { paginationNextVariants, paginationPreviousVariants } from '@/shared/components/pagination/pagination.variants';

import { ZardPaginationImports } from '../pagination.imports';

@Component({
  selector: 'z-demo-pagination-routing',
  imports: [ZardPaginationImports, RouterLink, NgIcon],
  template: `
    <z-pagination
      zAriaLabel="Routing pagination"
      [zTotal]="totalPages"
      [zPageIndex]="currentPage()"
      [zContent]="content"
    />

    <ng-template #content>
      <ul z-pagination-content>
        <li z-pagination-item>
          <a
            z-pagination-button
            zSize="default"
            [class]="previousClasses"
            [zDisabled]="currentPage() === 1"
            [routerLink]="currentPage() === 1 ? null : []"
            [queryParams]="{ page: previousPage() }"
            queryParamsHandling="merge"
            [attr.aria-disabled]="currentPage() === 1 ? 'true' : null"
          >
            <span class="sr-only">Go to previous page</span>
            <ng-icon name="lucideChevronLeft" aria-hidden="true" />
            <span class="hidden sm:block" aria-hidden="true">Previous</span>
          </a>
        </li>

        @for (page of pages; track page) {
          <li z-pagination-item>
            <a
              z-pagination-button
              [routerLink]="[]"
              [queryParams]="{ page }"
              queryParamsHandling="merge"
              [zActive]="page === currentPage()"
              [attr.aria-current]="page === currentPage() ? 'page' : null"
            >
              <span class="sr-only">To page</span>
              {{ page }}
            </a>
          </li>
        }

        <li z-pagination-item>
          <a
            z-pagination-button
            zSize="default"
            [class]="nextClasses"
            [zDisabled]="currentPage() === totalPages"
            [routerLink]="currentPage() === totalPages ? null : []"
            [queryParams]="{ page: nextPage() }"
            queryParamsHandling="merge"
            [attr.aria-disabled]="currentPage() === totalPages ? 'true' : null"
          >
            <span class="sr-only">Go to next page</span>
            <span class="hidden sm:block" aria-hidden="true">Next</span>
            <ng-icon name="lucideChevronRight" aria-hidden="true" />
          </a>
        </li>
      </ul>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
})
export class ZardDemoPaginationRoutingComponent {
  private readonly route = inject(ActivatedRoute);

  protected readonly totalPages = 5;
  protected readonly pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  protected readonly previousClasses = paginationPreviousVariants();
  protected readonly nextClasses = paginationNextVariants();

  private readonly queryParamMap = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected readonly currentPage = computed(() => {
    const page = Number(this.queryParamMap().get('page'));
    return Number.isInteger(page) && page >= 1 && page <= this.totalPages ? page : 1;
  });

  protected readonly previousPage = computed(() => Math.max(1, this.currentPage() - 1));
  protected readonly nextPage = computed(() => Math.min(this.totalPages, this.currentPage() + 1));
}
