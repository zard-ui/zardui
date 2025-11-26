import { Component, signal } from '@angular/core';

import { ZardPaginationModule } from '@ngzard/ui/pagination';

@Component({
  selector: 'z-demo-pagination-custom',
  imports: [ZardPaginationModule],
  standalone: true,
  template: `
    <z-pagination-content ariaLabel="Page navigation">
      <z-pagination-item>
        <z-pagination-previous (click)="goToPrevious()" />
      </z-pagination-item>

      @for (page of pages(); track page) {
        <z-pagination-item>
          <z-pagination-button [zActive]="page === currentPage()" (click)="goToPage(page)">
            {{ page }}
          </z-pagination-button>
        </z-pagination-item>
      }

      <z-pagination-item>
        <z-pagination-next (click)="goToNext()" />
      </z-pagination-item>
    </z-pagination-content>
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
