import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight, lucideChevronsLeft, lucideChevronsRight } from '@ng-icons/lucide';
import type { AngularTable, RowData, TableFeatures } from '@tanstack/angular-table';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { toDataTableInstance } from '@/shared/components/data-table/data-table.component';
import { dataTablePaginationVariants } from '@/shared/components/data-table/data-table.variants';
import { ZardSelectImports } from '@/shared/components/select/select.imports';
import { mergeClasses } from '@/shared/utils/merge-classes';

/** Selection count, rows-per-page select, page indicator and first/previous/next/last buttons. */
@Component({
  selector: 'z-data-table-pagination',
  imports: [ZardButtonComponent, ZardSelectImports, NgIcon],
  template: `
    <div class="flex items-center justify-between gap-4 px-2">
      <div class="text-muted-foreground min-w-0 flex-1 truncate text-sm">
        @if (hasSelection()) {
          {{ selectedCount() }} of {{ filteredCount() }} row(s) selected.
        }
      </div>
      <div class="flex items-center gap-4 @2xl:gap-8">
        <div class="flex items-center gap-2">
          <p class="hidden text-sm font-medium whitespace-nowrap @xl:block">Rows per page</p>
          <z-select class="w-20" [zValue]="pageSize()" (zSelectionChange)="setPageSize($event)">
            @for (size of zPageSizeOptions(); track size) {
              <z-select-item [zValue]="size.toString()">{{ size }}</z-select-item>
            }
          </z-select>
        </div>
        <div class="flex w-25 items-center justify-center text-sm font-medium whitespace-nowrap">
          Page {{ pageIndex() + 1 }} of {{ pageCount() }}
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            z-button
            zType="outline"
            zSize="icon"
            class="hidden size-8 @2xl:flex"
            [zDisabled]="!canPrevious()"
            (click)="table().firstPage()"
          >
            <span class="sr-only">Go to first page</span>
            <ng-icon name="lucideChevronsLeft" class="rtl:rotate-180" aria-hidden="true" />
          </button>
          <button
            type="button"
            z-button
            zType="outline"
            zSize="icon"
            class="size-8"
            [zDisabled]="!canPrevious()"
            (click)="table().previousPage()"
          >
            <span class="sr-only">Go to previous page</span>
            <ng-icon name="lucideChevronLeft" class="rtl:rotate-180" aria-hidden="true" />
          </button>
          <button
            type="button"
            z-button
            zType="outline"
            zSize="icon"
            class="size-8"
            [zDisabled]="!canNext()"
            (click)="table().nextPage()"
          >
            <span class="sr-only">Go to next page</span>
            <ng-icon name="lucideChevronRight" class="rtl:rotate-180" aria-hidden="true" />
          </button>
          <button
            type="button"
            z-button
            zType="outline"
            zSize="icon"
            class="hidden size-8 @2xl:flex"
            [zDisabled]="!canNext()"
            (click)="table().lastPage()"
          >
            <span class="sr-only">Go to last page</span>
            <ng-icon name="lucideChevronsRight" class="rtl:rotate-180" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideChevronLeft, lucideChevronRight, lucideChevronsLeft, lucideChevronsRight })],
  host: {
    'data-slot': 'data-table-pagination',
    '[class]': 'classes()',
  },
  exportAs: 'zDataTablePagination',
})
export class ZardDataTablePaginationComponent<TFeatures extends TableFeatures, TData extends RowData> {
  readonly zTable = input.required<AngularTable<TFeatures, TData>>();
  readonly zPageSizeOptions = input<number[]>([10, 20, 25, 30, 40, 50]);
  readonly class = input<ClassValue>('');

  protected readonly table = computed(() => toDataTableInstance(this.zTable()));

  protected readonly classes = computed(() => mergeClasses(dataTablePaginationVariants(), this.class()));

  private readonly pagination = computed(() => this.table().atoms.pagination.get());
  protected readonly pageIndex = computed(() => this.pagination().pageIndex);
  protected readonly pageSize = computed(() => this.pagination().pageSize.toString());
  protected readonly pageCount = computed(() => Math.max(this.table().getPageCount(), 1));
  protected readonly canPrevious = computed(() => this.table().getCanPreviousPage());
  protected readonly canNext = computed(() => this.table().getCanNextPage());

  protected readonly hasSelection = computed(() => typeof this.table().getFilteredSelectedRowModel === 'function');
  protected readonly selectedCount = computed(() => this.table().getFilteredSelectedRowModel().rows.length);
  protected readonly filteredCount = computed(() => {
    const table = this.table();
    // getFilteredRowModel comes with columnFilteringFeature; without it nothing is filtered out.
    const rows =
      typeof table.getFilteredRowModel === 'function' ? table.getFilteredRowModel() : table.getCoreRowModel();

    return rows.rows.length;
  });

  protected setPageSize(value: string | string[]): void {
    this.table().setPageSize(Number(value));
  }
}
