import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

import { ZardPaginationImports } from '../pagination.imports';

const translations: ZardRtlTranslations<{ previous: string; next: string }> = {
  en: {
    dir: 'ltr',
    values: {
      previous: 'Previous',
      next: 'Next',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      previous: 'السابق',
      next: 'التالي',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      previous: 'הקודם',
      next: 'הבא',
    },
  },
};

@Component({
  selector: 'z-demo-pagination-rtl',
  imports: [...ZardPaginationImports],
  template: `
    <z-pagination [zTotal]="3" [(zPageIndex)]="currentPage" [zContent]="content" />

    <ng-template #content>
      <ul z-pagination-content>
        <li z-pagination-item>
          <z-pagination-previous
            [zText]="i18n.t().previous"
            [zDisabled]="currentPage() === 1"
            (click)="go(currentPage() - 1)"
          />
        </li>

        @for (page of pages; track page) {
          <li z-pagination-item>
            <button type="button" z-pagination-button [zActive]="page === currentPage()" (click)="go(page)">
              {{ page }}
            </button>
          </li>
        }

        <li z-pagination-item>
          <z-pagination-ellipsis />
        </li>

        <li z-pagination-item>
          <z-pagination-next
            [zText]="i18n.t().next"
            [zDisabled]="currentPage() === 3"
            (click)="go(currentPage() + 1)"
          />
        </li>
      </ul>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPaginationRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  protected readonly pages = [1, 2, 3];
  protected readonly currentPage = signal(2);

  protected go(page: number) {
    if (page >= 1 && page <= 3) {
      this.currentPage.set(page);
    }
  }
}
