import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardFieldImports } from '@/shared/components/field';
import { ZardPaginationImports } from '@/shared/components/pagination';
import { ZardSelectImports } from '@/shared/components/select';

@Component({
  selector: 'z-demo-pagination-iconsonly',
  imports: [ZardPaginationImports, ZardFieldImports, ZardSelectImports],
  template: `
    <div class="flex w-full justify-around">
      <div class="flex w-fit gap-4">
        <div z-field class="flex-row items-center">
          <label z-field-label for="select-rows-per-page" class="min-w-max">Rows Per Page</label>
          <z-select id="select-rows-per-page" zSize="sm" [(zValue)]="perPage" class="min-w-20">
            <z-select-item zValue="10">10</z-select-item>
            <z-select-item zValue="25">25</z-select-item>
            <z-select-item zValue="50">50</z-select-item>
            <z-select-item zValue="100">100</z-select-item>
          </z-select>
        </div>
        <z-pagination [zTotal]="totalPages()" [(zPageIndex)]="currentPage" [zContent]="content" />
      </div>
    </div>

    <ng-template #content>
      <ul z-pagination-content>
        <li z-pagination-item>
          <z-pagination-previous (click)="goToPrevious()" [zDisabled]="currentPage() === 1" />
        </li>

        <li z-pagination-item>
          <z-pagination-next (click)="goToNext()" [zDisabled]="currentPage() === totalPages()" />
        </li>
      </ul>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ZardDemoPaginationIconsOnlyComponent {
  private totalItems = 350;

  readonly currentPage = signal(1);
  readonly perPage = signal('25');
  readonly totalPages = computed(() => Math.ceil(this.totalItems / parseInt(this.perPage())));

  goToPrevious() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
    }
  }

  goToNext() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
    }
  }
}
