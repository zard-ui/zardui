import { Component, signal } from '@angular/core';

import { ZardPaginationModule } from '../pagination.module';

@Component({
  selector: 'z-demo-pagination-custom',
  imports: [ZardPaginationModule],
  template: `
    <z-pagination [zTotal]="totalPages" [(zPageIndex)]="currentPage" [zContent]="content" />

    <ng-template #content>
      <ul z-pagination-content>
        <li z-pagination-item>
          <z-pagination-previous (click)="goToPrevious()" [zDisabled]="currentPage() === 1" />
        </li>

        @for (page of pages(); track page) {
          <li z-pagination-item>
            <button type="button" z-pagination-button [zActive]="page === currentPage()" (click)="goToPage(page)">
              <span class="sr-only">To page</span>
              {{ page }}
            </button>
          </li>
        }

        <li z-pagination-item>
          <z-pagination-ellipsis />
        </li>

        <li z-pagination-item>
          <z-pagination-next (click)="goToNext()" [zDisabled]="currentPage() === totalPages" />
        </li>
      </ul>
    </ng-template>
  `,
})
export class ZardDemoPaginationCustomComponent {
  readonly totalPages = 5;
  readonly currentPage = signal(3);

  readonly pages = signal<number[]>(Array.from({ length: this.totalPages }, (_, i) => i + 1));

  goToPage(page: number) {
    this.currentPage.set(page);
  }

  goToPrevious() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  goToNext() {
    if (this.currentPage() < this.totalPages) {
      this.currentPage.update(p => p + 1);
    }
  }
}
