---
title: Data Table
description: Powerful table and datagrids built using TanStack Table.
---

# Data Table

Powerful table and datagrids built using TanStack Table.

Every data table or datagrid is different: how it sorts, filters and paginates, and where its data comes from. Instead of one component with an option for each of those, this guide shows how to build your own with [TanStack Table](https://tanstack.com/table/latest/docs/framework/angular/angular-table) and [Table](/docs/components/table).

TanStack Table is headless: it holds the state and the logic, and you write the markup. `z-data-table` is the markup — it renders a TanStack table with `z-table` — and `z-data-table-column-header`, `z-data-table-pagination` and `z-data-table-view-options` are the parts most tables share. Each of them reads only the features your table declares.

## Installation

### CLI

```bash
npx zard-cli@latest add data-table
```

### Manual

```angular-ts
import { NgTemplateOutlet } from '@angular/common';
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  type TemplateRef,
  ViewEncapsulation,
} from '@angular/core';

import {
  type AngularTable,
  type Cell,
  type Column,
  FlexRender,
  type Header,
  type Row,
  type RowData,
  type TableFeatures,
} from '@tanstack/angular-table';
import type { ClassValue } from 'clsx';

import {
  dataTableBodyVariants,
  dataTableCellVariants,
  dataTableEmptyVariants,
  dataTableHeadVariants,
  dataTableResizeHandleVariants,
  dataTableVariants,
} from '@/shared/components/data-table/data-table.variants';
import { ZardTableImports } from '@/shared/components/table/table.imports';
import { mergeClasses } from '@/shared/utils/merge-classes';

/**
 * A TanStack table instance as the data-table pieces accept it.
 *
 * The features stay open (`any`) on purpose: each piece only calls the APIs of
 * the features it needs, and checks for them at run time, so one table built
 * with `injectTable` works with all of them whatever features it declares.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ZardDataTableFeatures = any;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ZardDataTableInstance<TData extends RowData = any> = AngularTable<ZardDataTableFeatures, TData>;

/**
 * Column meta `z-data-table` reads. Declare it on the features to type it:
 * `tableFeatures({ …, columnMeta: {} as ZardDataTableColumnMeta })`.
 */
export interface ZardDataTableColumnMeta {
  /** Classes for the column's `th`, such as `text-end`. */
  headerClass?: ClassValue;
  /** Classes for each of the column's `td`. */
  cellClass?: ClassValue;
}

/** Context of the `[zExpandedRow]` template: the row being expanded. */
export interface ZardDataTableExpandedRowContext<TFeatures extends TableFeatures, TData extends RowData> {
  $implicit: Row<TFeatures, TData>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRow = Row<ZardDataTableFeatures, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyColumn = Column<ZardDataTableFeatures, any, unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyHeader = Header<ZardDataTableFeatures, any, unknown>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyCell = Cell<ZardDataTableFeatures, any, unknown>;

/**
 * Views a typed table as the open {@link ZardDataTableInstance}. The pieces stay generic on their
 * `[zTable]` input so the consumer's table keeps its types; inside, only feature-checked calls happen.
 */
export function toDataTableInstance<TFeatures extends TableFeatures, TData extends RowData>(
  table: AngularTable<TFeatures, TData>,
): ZardDataTableInstance {
  return table as unknown as ZardDataTableInstance;
}

@Component({
  selector: 'z-data-table',
  imports: [FlexRender, NgTemplateOutlet, ZardTableImports],
  template: `
    <div data-slot="data-table-container" class="relative w-full overflow-x-auto">
      <table
        z-table
        [class]="tableClasses()"
        [style.width.px]="sized() ? table().getTotalSize() : null"
        [attr.aria-busy]="zLoading() || null"
      >
        <thead z-table-header>
          @for (headerGroup of table().getHeaderGroups(); track headerGroup.id) {
            <tr z-table-row>
              @for (header of headerGroup.headers; track header.id) {
                <th
                  z-table-head
                  scope="col"
                  [attr.colspan]="header.colSpan > 1 ? header.colSpan : null"
                  [attr.data-pinned]="pinned(header.column) || null"
                  [class]="headClasses(header)"
                  [style]="columnStyles(header.column, header.getSize?.())"
                >
                  @if (!header.isPlaceholder) {
                    <ng-container *flexRenderHeader="header; let value">{{ value }}</ng-container>
                  }
                  @if (canResize(header)) {
                    <div
                      role="separator"
                      aria-orientation="vertical"
                      [attr.aria-label]="'Resize ' + header.column.id"
                      [attr.data-resizing]="header.column.getIsResizing() || null"
                      [class]="resizeHandleClasses()"
                      (mousedown)="resize(header, $event)"
                      (touchstart)="resize(header, $event)"
                      (dblclick)="header.column.resetSize()"
                    ></div>
                  }
                </th>
              }
            </tr>
          }
        </thead>
        <tbody z-table-body [class]="bodyClasses()">
          @for (row of table().getRowModel().rows; track row.id) {
            <tr
              z-table-row
              class="group/row"
              [attr.data-state]="isSelected(row) ? 'selected' : null"
              [attr.data-expanded]="isExpanded(row) || null"
            >
              @for (cell of cells(row); track cell.id) {
                <td
                  z-table-cell
                  [attr.data-pinned]="pinned(cell.column) || null"
                  [class]="cellClasses(cell)"
                  [style]="columnStyles(cell.column, cell.column.getSize?.())"
                >
                  <ng-container *flexRenderCell="cell; let value">{{ value }}</ng-container>
                </td>
              }
            </tr>
            @if (zExpandedRow() && isExpanded(row)) {
              <tr z-table-row data-slot="data-table-expanded-row" class="hover:bg-transparent">
                <td z-table-cell [attr.colspan]="columnCount()" class="p-0">
                  <ng-container *ngTemplateOutlet="zExpandedRow()!; context: expandedContext(row)" />
                </td>
              </tr>
            }
          } @empty {
            <tr z-table-row>
              <td z-table-cell [attr.colspan]="columnCount()" [class]="emptyClasses()">
                {{ zLoading() ? zLoadingText() : zEmptyText() }}
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'data-table',
    '[class]': 'classes()',
  },
  exportAs: 'zDataTable',
})
export class ZardDataTableComponent<TFeatures extends TableFeatures, TData extends RowData> {
  readonly zTable = input.required<AngularTable<TFeatures, TData>>();
  /** Rendered in a full-width row under each expanded row (rowExpandingFeature). */
  readonly zExpandedRow = input<TemplateRef<ZardDataTableExpandedRowContext<TFeatures, TData>>>();
  /** Dims the rows and sets `aria-busy` while data loads, such as between server-side pages. */
  readonly zLoading = input(false, { transform: booleanAttribute });
  readonly zEmptyText = input<string>('No results.');
  readonly zLoadingText = input<string>('Loading...');
  readonly zTableClass = input<ClassValue>('');
  readonly class = input<ClassValue>('');

  protected readonly table = computed(() => toDataTableInstance(this.zTable()));

  /** Column sizes apply once the table has columnSizingFeature; without it the browser lays columns out. */
  protected readonly sized = computed(() => typeof this.table().getTotalSize === 'function');

  protected readonly classes = computed(() => mergeClasses(dataTableVariants(), this.class()));
  protected readonly tableClasses = computed(() => mergeClasses(this.sized() && 'table-fixed', this.zTableClass()));
  protected readonly bodyClasses = computed(() => mergeClasses(dataTableBodyVariants({ zLoading: this.zLoading() })));
  protected readonly emptyClasses = computed(() => mergeClasses(dataTableEmptyVariants()));
  protected readonly resizeHandleClasses = computed(() => mergeClasses(dataTableResizeHandleVariants()));

  protected readonly columnCount = computed(() => {
    const table = this.table();
    // getVisibleLeafColumns comes with columnVisibilityFeature; without it every column shows.
    const leafColumns =
      typeof table.getVisibleLeafColumns === 'function' ? table.getVisibleLeafColumns() : table.getAllLeafColumns();

    return leafColumns.length || 1;
  });

  /** The row's visible cells, or all of them when the table has no columnVisibilityFeature. */
  protected cells(row: AnyRow): AnyCell[] {
    return typeof row.getVisibleCells === 'function' ? row.getVisibleCells() : row.getAllCells();
  }

  protected isSelected(row: AnyRow): boolean {
    return typeof row.getIsSelected === 'function' && row.getIsSelected();
  }

  protected isExpanded(row: AnyRow): boolean {
    return typeof row.getIsExpanded === 'function' && row.getIsExpanded();
  }

  protected expandedContext(row: AnyRow): ZardDataTableExpandedRowContext<TFeatures, TData> {
    return { $implicit: row as unknown as Row<TFeatures, TData> };
  }

  protected pinned(column: AnyColumn): false | 'start' | 'end' {
    return typeof column.getIsPinned === 'function' ? column.getIsPinned() : false;
  }

  protected canResize(header: AnyHeader): boolean {
    return typeof header.column.getCanResize === 'function' && header.column.getCanResize();
  }

  protected resize(header: AnyHeader, event: Event): void {
    header.getResizeHandler()(event);
  }

  protected headClasses(header: AnyHeader): string {
    return mergeClasses(
      dataTableHeadVariants({ zPinned: this.pinned(header.column) || 'none', zEdge: this.pinnedEdge(header.column) }),
      this.meta(header.column)?.headerClass,
    );
  }

  protected cellClasses(cell: AnyCell): string {
    return mergeClasses(
      dataTableCellVariants({ zPinned: this.pinned(cell.column) || 'none', zEdge: this.pinnedEdge(cell.column) }),
      this.meta(cell.column)?.cellClass,
    );
  }

  /** Width from columnSizingFeature, and the sticky offset of a pinned column, in logical (RTL-aware) properties. */
  protected columnStyles(column: AnyColumn, size: number | undefined): Record<string, string> | null {
    const styles: Record<string, string> = {};

    if (this.sized() && size !== undefined) {
      styles['width'] = `${size}px`;
    }

    // The offset of a pinned column is the width of the pinned columns before it, which only
    // columnSizingFeature knows. Without it every pinned column sits at the edge: pin one per side.
    const pinned = this.pinned(column);
    if (pinned === 'start') {
      styles['inset-inline-start'] = `${this.sized() ? column.getStart('start') : 0}px`;
    } else if (pinned === 'end') {
      styles['inset-inline-end'] = `${this.sized() ? column.getAfter('end') : 0}px`;
    }

    return Object.keys(styles).length ? styles : null;
  }

  /** Marks the pinned column that borders the scrolling ones, which draws the divider. */
  private pinnedEdge(column: AnyColumn): boolean {
    const pinned = this.pinned(column);
    if (pinned === 'start') {
      return column.getPinnedIndex() === this.table().getStartVisibleLeafColumns().length - 1;
    }

    return pinned === 'end' && column.getPinnedIndex() === 0;
  }

  private meta(column: AnyColumn): ZardDataTableColumnMeta | undefined {
    return column.columnDef.meta as ZardDataTableColumnMeta | undefined;
  }
}
```

```angular-ts
import { cva } from 'class-variance-authority';

export const dataTableVariants = cva('block w-full overflow-hidden rounded-md border');

export const dataTableBodyVariants = cva('transition-opacity', {
  variants: {
    zLoading: {
      true: 'pointer-events-none opacity-60',
      false: '',
    },
  },
  defaultVariants: {
    zLoading: false,
  },
});

/**
 * Pinned columns stick while the rest scrolls, so they need a solid background. The row's hover and
 * selected tints are mixed into it, because a translucent tint would let the scrolled cells show through.
 */
const pinnedVariants = {
  zPinned: {
    none: '',
    start:
      'sticky z-10 bg-background group-hover/row:bg-[color-mix(in_oklab,var(--color-muted)_50%,var(--color-background))] group-data-[state=selected]/row:bg-muted',
    end: 'sticky z-10 bg-background group-hover/row:bg-[color-mix(in_oklab,var(--color-muted)_50%,var(--color-background))] group-data-[state=selected]/row:bg-muted',
  },
  zEdge: {
    true: '',
    false: '',
  },
};

const pinnedEdgeVariants = [
  { zPinned: 'start' as const, zEdge: true, class: 'border-e' },
  { zPinned: 'end' as const, zEdge: true, class: 'border-s' },
];

export const dataTableHeadVariants = cva('relative', {
  variants: pinnedVariants,
  compoundVariants: pinnedEdgeVariants,
  defaultVariants: { zPinned: 'none', zEdge: false },
});

export const dataTableCellVariants = cva('', {
  variants: pinnedVariants,
  compoundVariants: pinnedEdgeVariants,
  defaultVariants: { zPinned: 'none', zEdge: false },
});

export const dataTableResizeHandleVariants = cva(
  'absolute inset-y-0 end-0 z-1 w-1 cursor-col-resize touch-none bg-border opacity-0 select-none hover:opacity-100 data-resizing:bg-primary data-resizing:opacity-100',
);

export const dataTableEmptyVariants = cva('h-24 text-center');

export const dataTableColumnHeaderVariants = cva('flex items-center gap-2');

/** A size container: the controls that fit follow the width the table has, not the viewport's. */
export const dataTablePaginationVariants = cva('@container block');

export const dataTableViewOptionsVariants = cva('ms-auto hidden h-8 lg:flex');
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideArrowUp,
  lucideChevronsUpDown,
  lucideEyeOff,
  lucidePin,
  lucidePinOff,
} from '@ng-icons/lucide';
import { injectTableHeaderContext, type RowData } from '@tanstack/angular-table';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import type { ZardDataTableFeatures } from '@/shared/components/data-table/data-table.component';
import { dataTableColumnHeaderVariants } from '@/shared/components/data-table/data-table.variants';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { mergeClasses } from '@/shared/utils/merge-classes';

/**
 * A sortable, pinnable, hideable column header — each action shows when the table has its
 * feature. Render it from a column definition, where TanStack hands it the header through DI:
 *
 * `header: () => flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle: 'Email' } })`
 */
@Component({
  selector: 'z-data-table-column-header',
  imports: [ZardButtonComponent, ZardDropdownImports, NgIcon],
  template: `
    @if (canSort() || canPin()) {
      <button
        type="button"
        z-button
        zType="ghost"
        zSize="sm"
        class="data-[state=open]:bg-accent -ms-2.5 h-8"
        z-dropdown
        [zDropdownMenu]="menu"
      >
        <span>{{ zTitle() }}</span>
        @if (pinned()) {
          <ng-icon name="lucidePin" aria-hidden="true" />
        }
        @switch (sorted()) {
          @case ('desc') {
            <ng-icon name="lucideArrowDown" aria-hidden="true" />
          }
          @case ('asc') {
            <ng-icon name="lucideArrowUp" aria-hidden="true" />
          }
          @default {
            @if (canSort()) {
              <ng-icon name="lucideChevronsUpDown" aria-hidden="true" />
            }
          }
        }
      </button>

      <z-dropdown-menu-content #menu="zDropdownMenuContent" zAlign="start">
        @if (canSort()) {
          <z-dropdown-menu-item (click)="sort(false)">
            <ng-icon name="lucideArrowUp" aria-hidden="true" />
            Asc
          </z-dropdown-menu-item>
          <z-dropdown-menu-item (click)="sort(true)">
            <ng-icon name="lucideArrowDown" aria-hidden="true" />
            Desc
          </z-dropdown-menu-item>
        }
        @if (canPin()) {
          @if (canSort()) {
            <z-dropdown-menu-separator />
          }
          @if (pinned() !== 'start') {
            <z-dropdown-menu-item (click)="pin('start')">
              <ng-icon name="lucidePin" aria-hidden="true" />
              Pin to start
            </z-dropdown-menu-item>
          }
          @if (pinned() !== 'end') {
            <z-dropdown-menu-item (click)="pin('end')">
              <ng-icon name="lucidePin" aria-hidden="true" />
              Pin to end
            </z-dropdown-menu-item>
          }
          @if (pinned()) {
            <z-dropdown-menu-item (click)="pin(false)">
              <ng-icon name="lucidePinOff" aria-hidden="true" />
              Unpin
            </z-dropdown-menu-item>
          }
        }
        @if (canHide()) {
          <z-dropdown-menu-separator />
          <z-dropdown-menu-item (click)="hide()">
            <ng-icon name="lucideEyeOff" aria-hidden="true" />
            Hide
          </z-dropdown-menu-item>
        }
      </z-dropdown-menu-content>
    } @else {
      <span>{{ zTitle() }}</span>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [
    provideIcons({ lucideArrowDown, lucideArrowUp, lucideChevronsUpDown, lucideEyeOff, lucidePin, lucidePinOff }),
  ],
  host: {
    'data-slot': 'data-table-column-header',
    '[class]': 'classes()',
  },
  exportAs: 'zDataTableColumnHeader',
})
export class ZardDataTableColumnHeaderComponent {
  readonly zTitle = input.required<string>();
  readonly class = input<ClassValue>('');

  private readonly header = injectTableHeaderContext<ZardDataTableFeatures, RowData, unknown>();
  private readonly column = computed(() => this.header().column);

  protected readonly classes = computed(() => mergeClasses(dataTableColumnHeaderVariants(), this.class()));
  protected readonly canSort = computed(
    () => typeof this.column().getCanSort === 'function' && this.column().getCanSort(),
  );

  protected readonly canHide = computed(
    () => typeof this.column().getCanHide === 'function' && this.column().getCanHide(),
  );

  protected readonly canPin = computed(
    () => typeof this.column().getCanPin === 'function' && this.column().getCanPin(),
  );

  protected readonly sorted = computed<false | 'asc' | 'desc'>(() =>
    typeof this.column().getIsSorted === 'function' ? this.column().getIsSorted() : false,
  );

  protected readonly pinned = computed<false | 'start' | 'end'>(() =>
    typeof this.column().getIsPinned === 'function' ? this.column().getIsPinned() : false,
  );

  protected sort(desc: boolean): void {
    this.column().toggleSorting(desc);
  }

  protected pin(position: false | 'start' | 'end'): void {
    this.column().pin(position);
  }

  protected hide(): void {
    this.column().toggleVisibility(false);
  }
}
```

```angular-ts
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
```

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSettings2 } from '@ng-icons/lucide';
import type { AngularTable, RowData, TableFeatures } from '@tanstack/angular-table';
import type { ClassValue } from 'clsx';

import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { toDataTableInstance } from '@/shared/components/data-table/data-table.component';
import { dataTableViewOptionsVariants } from '@/shared/components/data-table/data-table.variants';
import { ZardDropdownImports } from '@/shared/components/dropdown/dropdown.imports';
import { mergeClasses } from '@/shared/utils/merge-classes';

/** A "View" dropdown that toggles the visibility of the hideable data columns. */
@Component({
  selector: 'z-data-table-view-options',
  imports: [ZardButtonComponent, ZardDropdownImports, NgIcon],
  template: `
    <button type="button" z-button zType="outline" zSize="sm" [class]="classes()" z-dropdown [zDropdownMenu]="menu">
      <ng-icon name="lucideSettings2" aria-hidden="true" />
      {{ zLabel() }}
    </button>

    <z-dropdown-menu-content #menu="zDropdownMenuContent" zAlign="end" class="w-40">
      <z-dropdown-menu-label>Toggle columns</z-dropdown-menu-label>
      <z-dropdown-menu-separator />
      @for (column of columns(); track column.id) {
        <z-dropdown-menu-checkbox-item
          class="capitalize"
          [zChecked]="column.getIsVisible()"
          (zCheckedChange)="column.toggleVisibility($event)"
        >
          {{ column.id }}
        </z-dropdown-menu-checkbox-item>
      }
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  viewProviders: [provideIcons({ lucideSettings2 })],
  host: {
    'data-slot': 'data-table-view-options',
    class: 'contents',
  },
  exportAs: 'zDataTableViewOptions',
})
export class ZardDataTableViewOptionsComponent<TFeatures extends TableFeatures, TData extends RowData> {
  readonly zTable = input.required<AngularTable<TFeatures, TData>>();
  readonly zLabel = input<string>('View');
  readonly class = input<ClassValue>('');

  protected readonly table = computed(() => toDataTableInstance(this.zTable()));

  protected readonly classes = computed(() => mergeClasses(dataTableViewOptionsVariants(), this.class()));

  protected readonly columns = computed(() =>
    this.table()
      .getAllColumns()
      .filter(column => typeof column.accessorFn !== 'undefined' && column.getCanHide()),
  );
}
```

```angular-ts
import { ZardDataTableColumnHeaderComponent } from '@/shared/components/data-table/data-table-column-header.component';
import { ZardDataTablePaginationComponent } from '@/shared/components/data-table/data-table-pagination.component';
import { ZardDataTableViewOptionsComponent } from '@/shared/components/data-table/data-table-view-options.component';
import { ZardDataTableComponent } from '@/shared/components/data-table/data-table.component';

export const ZardDataTableImports = [
  ZardDataTableComponent,
  ZardDataTableColumnHeaderComponent,
  ZardDataTablePaginationComponent,
  ZardDataTableViewOptionsComponent,
] as const;
```

```angular-ts
export * from './data-table.component';
export * from './data-table-column-header.component';
export * from './data-table-pagination.component';
export * from './data-table-view-options.component';
export * from './data-table.imports';
export * from './data-table.variants';
```

## Usage

```angular-ts
import { injectTable, rowPaginationFeature, tableFeatures } from '@tanstack/angular-table';

import { ZardDataTableImports } from '@/shared/components/data-table/data-table.imports';

const features = tableFeatures({ rowPaginationFeature });
const columns = [
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'amount', header: 'Amount' },
];

// In the component class:
readonly table = injectTable(() => ({ features, columns, data: this.data() }));
```

```angular-html
<z-data-table [zTable]="table" />
<z-data-table-pagination [zTable]="table" />
```

## Prerequisites

We are going to build a table to show recent payments. Here is what our data looks like:

```angular-ts
export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
}

export const PAYMENTS: Payment[] = [
  { id: 'm5gr84i9', amount: 316, status: 'success', email: 'ken99@example.com' },
  { id: '3u1reuv4', amount: 242, status: 'success', email: 'Abe45@example.com' },
  { id: 'derv1ws0', amount: 837, status: 'processing', email: 'Monserrat44@example.com' },
  { id: '5kma53ae', amount: 874, status: 'success', email: 'Silas22@example.com' },
  { id: 'bhqecj4p', amount: 721, status: 'failed', email: 'carmella@example.com' },
  { id: 'p8x2kq7n', amount: 129, status: 'pending', email: 'lena.ortiz@example.com' },
  { id: 'z4m9d1rt', amount: 563, status: 'success', email: 'omar_h@example.com' },
  { id: 'c7v0w2yb', amount: 98, status: 'failed', email: 'june.park@example.com' },
  { id: 'q1n6s8ue', amount: 450, status: 'processing', email: 'theo.martin@example.com' },
  { id: 'h3j5l9fa', amount: 287, status: 'success', email: 'ines.costa@example.com' },
  { id: 'w2e8r4tz', amount: 690, status: 'pending', email: 'noah.b@example.com' },
  { id: 'k9b3x7cm', amount: 145, status: 'success', email: 'maya.lee@example.com' },
];
```

## Project Structure

Start with one file per concern. The examples below keep each step in a single file so you can read it top to bottom.

```text
src/app/payments
├── payments.ts        # the Payment type and the data
├── features.ts        # tableFeatures(): what the table can do
├── columns.ts         # the column definitions
└── payments-table.ts  # the component: injectTable() + <z-data-table>
```

## Set up Table Features

TanStack Table v9 is feature-based: you opt into the behavior you want with `tableFeatures()`. Declare the features once, outside any component, and pass them to every `injectTable` call. The core row model is always included; the optional ones (`createSortedRowModel()`, `createFilteredRowModel()`, …) are registered here too. The `columnMeta` slot types the column `meta` that `z-data-table` reads.

```angular-ts
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/angular-table';

import type { ZardDataTableColumnMeta } from '@/shared/components/data-table';

export const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  columnMeta: {} as ZardDataTableColumnMeta,
});

export type DataTableFeatures = typeof features;
```

## Basic Table

Define the columns with `createColumnHelper`, create the table with `injectTable` in a field initializer, and hand it to `z-data-table`. Keep the features and the columns outside the initializer: only the data should change there.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { createColumnHelper, injectTable } from '@tanstack/angular-table';

import { ZardDataTableImports } from '@/shared/components/data-table';

import { features } from './features';
import { type Payment, PAYMENTS } from './payments';

const columnHelper = createColumnHelper<typeof features, Payment>();

const columns = columnHelper.columns([
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('amount', { header: 'Amount' }),
]);

@Component({
  selector: 'z-demo-data-table-basic',
  imports: [ZardDataTableImports],
  template: `
    <z-data-table [zTable]="table" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoDataTableBasicComponent {
  readonly data = signal<Payment[]>(PAYMENTS);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
  }));
}
```

## Cell Formatting

A `cell` function formats the value. To align the column, set `meta.headerClass` and `meta.cellClass`: `z-data-table` adds them to the column’s `th` and `td`.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { createColumnHelper, injectTable } from '@tanstack/angular-table';

import { ZardDataTableImports } from '@/shared/components/data-table';

import { features } from './features';
import { type Payment, PAYMENTS } from './payments';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const columnHelper = createColumnHelper<typeof features, Payment>();

const columns = columnHelper.columns([
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },
  }),
]);

@Component({
  selector: 'z-demo-data-table-cell-formatting',
  imports: [ZardDataTableImports],
  template: `
    <z-data-table [zTable]="table" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoDataTableCellFormattingComponent {
  readonly data = signal<Payment[]>(PAYMENTS);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
  }));
}
```

**Column meta**

```angular-ts
const features = tableFeatures({
  // …
  columnMeta: {} as ZardDataTableColumnMeta,
});

columnHelper.accessor('amount', {
  header: 'Amount',
  meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },
}),
```

## Row Actions

A cell can render a component. Return `flexRenderComponent(...)` from `cell`, and read the row inside the component with `injectTableCellContext()` — `row.original` is that row’s data, so an action such as a delete call can use its `id`.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';
import { createColumnHelper, flexRenderComponent, injectTable, injectTableCellContext } from '@tanstack/angular-table';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDataTableImports } from '@/shared/components/data-table';
import { ZardDropdownImports } from '@/shared/components/dropdown';

import { type DataTableFeatures, features } from './features';
import { type Payment, PAYMENTS } from './payments';

/** Rendered in the actions column. `row.original` is the payment of that row. */
@Component({
  selector: 'z-demo-payment-actions',
  imports: [ZardButtonComponent, ZardDropdownImports, NgIcon],
  template: `
    <button type="button" z-button zType="ghost" zSize="icon" class="size-8" z-dropdown [zDropdownMenu]="menu">
      <span class="sr-only">Open menu</span>
      <ng-icon name="lucideEllipsis" aria-hidden="true" />
    </button>
    <z-dropdown-menu-content #menu="zDropdownMenuContent" zAlign="end">
      <z-dropdown-menu-label>Actions</z-dropdown-menu-label>
      <z-dropdown-menu-item (click)="copyId()">Copy payment ID</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>View customer</z-dropdown-menu-item>
      <z-dropdown-menu-item>View payment details</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideEllipsis })],
  host: { class: 'flex justify-end' },
})
export class PaymentActionsComponent {
  private readonly cell = injectTableCellContext<DataTableFeatures, Payment, unknown>();

  protected copyId(): void {
    void navigator.clipboard?.writeText(this.cell().row.original.id);
  }
}

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const columnHelper = createColumnHelper<typeof features, Payment>();

const columns = columnHelper.columns([
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },
  }),
  columnHelper.display({
    id: 'actions',
    cell: () => flexRenderComponent(PaymentActionsComponent),
  }),
]);

@Component({
  selector: 'z-demo-data-table-row-actions',
  imports: [ZardDataTableImports],
  template: `
    <z-data-table [zTable]="table" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoDataTableRowActionsComponent {
  readonly data = signal<Payment[]>(PAYMENTS);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
  }));
}
```

## Pagination

Pagination is already on: the features include `rowPaginationFeature` and `createPaginatedRowModel()`, so the table splits the rows into pages of 10. Add the controls with `table.previousPage()` and `table.nextPage()`.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { createColumnHelper, flexRenderComponent, injectTable } from '@tanstack/angular-table';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDataTableImports } from '@/shared/components/data-table';

import { features } from './features';
import { type Payment, PAYMENTS } from './payments';
import { PaymentActionsComponent } from './row-actions';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const columnHelper = createColumnHelper<typeof features, Payment>();

const columns = columnHelper.columns([
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },
  }),
  columnHelper.display({ id: 'actions', cell: () => flexRenderComponent(PaymentActionsComponent) }),
]);

@Component({
  selector: 'z-demo-data-table-pagination',
  imports: [ZardDataTableImports, ZardButtonComponent],
  template: `
    <z-data-table [zTable]="table" />
    <div class="flex items-center justify-end gap-2 py-4">
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanPreviousPage()"
        (click)="table.previousPage()"
      >
        Previous
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanNextPage()"
        (click)="table.nextPage()"
      >
        Next
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoDataTablePaginationComponent {
  readonly data = signal<Payment[]>(PAYMENTS);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    // Pages of 10 are the default; 5 makes the second page visible with this short list.
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  }));
}
```

## Sorting

Sorting is on too, through `rowSortingFeature`. Make a header sortable by rendering a component that reads its column with `injectTableHeaderContext()` and calls `column.toggleSorting()`.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown } from '@ng-icons/lucide';
import {
  createColumnHelper,
  flexRenderComponent,
  injectTable,
  injectTableHeaderContext,
} from '@tanstack/angular-table';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDataTableImports } from '@/shared/components/data-table';

import { type DataTableFeatures, features } from './features';
import { type Payment, PAYMENTS } from './payments';
import { PaymentActionsComponent } from './row-actions';

/** Rendered as the email header. Each click flips the sort between ascending and descending. */
@Component({
  selector: 'z-demo-payment-email-header',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <button type="button" z-button zType="ghost" class="-ms-2.5" (click)="toggle()">
      Email
      <ng-icon name="lucideArrowUpDown" aria-hidden="true" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpDown })],
})
export class PaymentEmailHeaderComponent {
  private readonly header = injectTableHeaderContext<DataTableFeatures, Payment, unknown>();

  protected toggle(): void {
    const column = this.header().column;
    column.toggleSorting(column.getIsSorted() === 'asc');
  }
}

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const columnHelper = createColumnHelper<typeof features, Payment>();

const columns = columnHelper.columns([
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('email', { header: () => flexRenderComponent(PaymentEmailHeaderComponent) }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },
  }),
  columnHelper.display({ id: 'actions', cell: () => flexRenderComponent(PaymentActionsComponent) }),
]);

@Component({
  selector: 'z-demo-data-table-sorting',
  imports: [ZardDataTableImports, ZardButtonComponent],
  template: `
    <z-data-table [zTable]="table" />
    <div class="flex items-center justify-end gap-2 py-4">
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanPreviousPage()"
        (click)="table.previousPage()"
      >
        Previous
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanNextPage()"
        (click)="table.nextPage()"
      >
        Next
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoDataTableSortingComponent {
  readonly data = signal<Payment[]>(PAYMENTS);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  }));
}
```

## Filtering

With `columnFilteringFeature` in the features, filter a column with `column.setFilterValue()`. Here an input filters the emails.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { createColumnHelper, flexRenderComponent, injectTable } from '@tanstack/angular-table';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDataTableImports } from '@/shared/components/data-table';
import { ZardInputComponent } from '@/shared/components/input';

import { features } from './features';
import { type Payment, PAYMENTS } from './payments';
import { PaymentActionsComponent } from './row-actions';
import { PaymentEmailHeaderComponent } from './sorting';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const columnHelper = createColumnHelper<typeof features, Payment>();

const columns = columnHelper.columns([
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('email', { header: () => flexRenderComponent(PaymentEmailHeaderComponent) }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },
  }),
  columnHelper.display({ id: 'actions', cell: () => flexRenderComponent(PaymentActionsComponent) }),
]);

@Component({
  selector: 'z-demo-data-table-filtering',
  imports: [ZardDataTableImports, ZardButtonComponent, ZardInputComponent],
  template: `
    <div class="flex items-center py-4">
      <input
        z-input
        class="max-w-sm"
        placeholder="Filter emails..."
        aria-label="Filter emails"
        [value]="emailFilter()"
        (input)="filterEmails($event)"
      />
    </div>
    <z-data-table [zTable]="table" />
    <div class="flex items-center justify-end gap-2 py-4">
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanPreviousPage()"
        (click)="table.previousPage()"
      >
        Previous
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanNextPage()"
        (click)="table.nextPage()"
      >
        Next
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoDataTableFilteringComponent {
  readonly data = signal<Payment[]>(PAYMENTS);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  }));

  protected readonly emailFilter = computed(() => (this.table.getColumn('email')?.getFilterValue() as string) ?? '');

  protected filterEmails(event: Event): void {
    this.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
  }
}
```

## Visibility

Columns can be hidden with `column.toggleVisibility()`. This adds a dropdown menu that toggles the columns; `enableHiding: false` keeps a column out of it.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { createColumnHelper, flexRenderComponent, injectTable } from '@tanstack/angular-table';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDataTableImports } from '@/shared/components/data-table';
import { ZardDropdownImports } from '@/shared/components/dropdown';
import { ZardInputComponent } from '@/shared/components/input';

import { features } from './features';
import { type Payment, PAYMENTS } from './payments';
import { PaymentActionsComponent } from './row-actions';
import { PaymentEmailHeaderComponent } from './sorting';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const columnHelper = createColumnHelper<typeof features, Payment>();

const columns = columnHelper.columns([
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('email', { header: () => flexRenderComponent(PaymentEmailHeaderComponent) }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },
  }),
  columnHelper.display({
    id: 'actions',
    cell: () => flexRenderComponent(PaymentActionsComponent),
    enableHiding: false,
  }),
]);

@Component({
  selector: 'z-demo-data-table-visibility',
  imports: [ZardDataTableImports, ZardButtonComponent, ZardDropdownImports, ZardInputComponent, NgIcon],
  template: `
    <div class="flex items-center gap-2 py-4">
      <input
        z-input
        class="max-w-sm"
        placeholder="Filter emails..."
        aria-label="Filter emails"
        [value]="emailFilter()"
        (input)="filterEmails($event)"
      />
      <button type="button" z-button zType="outline" class="ms-auto" z-dropdown [zDropdownMenu]="columnsMenu">
        Columns
        <ng-icon name="lucideChevronDown" aria-hidden="true" />
      </button>
      <z-dropdown-menu-content #columnsMenu="zDropdownMenuContent" zAlign="end">
        @for (column of hideableColumns(); track column.id) {
          <z-dropdown-menu-checkbox-item
            class="capitalize"
            [zChecked]="column.getIsVisible()"
            (zCheckedChange)="column.toggleVisibility($event)"
          >
            {{ column.id }}
          </z-dropdown-menu-checkbox-item>
        }
      </z-dropdown-menu-content>
    </div>
    <z-data-table [zTable]="table" />
    <div class="flex items-center justify-end gap-2 py-4">
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanPreviousPage()"
        (click)="table.previousPage()"
      >
        Previous
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanNextPage()"
        (click)="table.nextPage()"
      >
        Next
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
  host: { class: 'block w-full' },
})
export class ZardDemoDataTableVisibilityComponent {
  readonly data = signal<Payment[]>(PAYMENTS);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  }));

  protected readonly hideableColumns = computed(() => this.table.getAllColumns().filter(column => column.getCanHide()));

  protected readonly emailFilter = computed(() => (this.table.getColumn('email')?.getFilterValue() as string) ?? '');

  protected filterEmails(event: Event): void {
    this.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
  }
}
```

## Row Selection

Add a `select` column with a checkbox in the header that selects the whole page, and one in each row. `table.getFilteredSelectedRowModel()` gives the selected rows, which `z-data-table` also marks with `data-state="selected"`.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import {
  createColumnHelper,
  flexRenderComponent,
  injectTable,
  injectTableCellContext,
  injectTableContext,
} from '@tanstack/angular-table';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCheckboxComponent } from '@/shared/components/checkbox';
import { ZardDataTableImports } from '@/shared/components/data-table';
import { ZardDropdownImports } from '@/shared/components/dropdown';
import { ZardInputComponent } from '@/shared/components/input';

import { type DataTableFeatures, features } from './features';
import { type Payment, PAYMENTS } from './payments';
import { PaymentActionsComponent } from './row-actions';
import { PaymentEmailHeaderComponent } from './sorting';

/** Header checkbox: selects or clears every row of the current page. */
@Component({
  selector: 'z-demo-select-all-rows',
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <z-checkbox
      [ngModel]="table().getIsAllPageRowsSelected()"
      (ngModelChange)="table().toggleAllPageRowsSelected($event)"
    >
      <span class="sr-only">Select all</span>
    </z-checkbox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectAllRowsComponent {
  protected readonly table = injectTableContext<DataTableFeatures, Payment>();
}

/** Row checkbox. */
@Component({
  selector: 'z-demo-select-row',
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <z-checkbox [ngModel]="cell().row.getIsSelected()" (ngModelChange)="cell().row.toggleSelected($event)">
      <span class="sr-only">Select row</span>
    </z-checkbox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectRowComponent {
  protected readonly cell = injectTableCellContext<DataTableFeatures, Payment, unknown>();
}

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const columnHelper = createColumnHelper<typeof features, Payment>();

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: () => flexRenderComponent(SelectAllRowsComponent),
    cell: () => flexRenderComponent(SelectRowComponent),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('email', { header: () => flexRenderComponent(PaymentEmailHeaderComponent) }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },
  }),
  columnHelper.display({
    id: 'actions',
    cell: () => flexRenderComponent(PaymentActionsComponent),
    enableHiding: false,
  }),
]);

@Component({
  selector: 'z-demo-data-table-row-selection',
  imports: [ZardDataTableImports, ZardButtonComponent, ZardDropdownImports, ZardInputComponent, NgIcon],
  template: `
    <div class="flex items-center gap-2 py-4">
      <input
        z-input
        class="max-w-sm"
        placeholder="Filter emails..."
        aria-label="Filter emails"
        [value]="emailFilter()"
        (input)="filterEmails($event)"
      />
      <button type="button" z-button zType="outline" class="ms-auto" z-dropdown [zDropdownMenu]="columnsMenu">
        Columns
        <ng-icon name="lucideChevronDown" aria-hidden="true" />
      </button>
      <z-dropdown-menu-content #columnsMenu="zDropdownMenuContent" zAlign="end">
        @for (column of hideableColumns(); track column.id) {
          <z-dropdown-menu-checkbox-item
            class="capitalize"
            [zChecked]="column.getIsVisible()"
            (zCheckedChange)="column.toggleVisibility($event)"
          >
            {{ column.id }}
          </z-dropdown-menu-checkbox-item>
        }
      </z-dropdown-menu-content>
    </div>
    <z-data-table [zTable]="table" />
    <div class="flex items-center justify-end gap-2 py-4">
      <div class="text-muted-foreground flex-1 text-sm">
        {{ table.getFilteredSelectedRowModel().rows.length }} of {{ table.getFilteredRowModel().rows.length }} row(s)
        selected.
      </div>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanPreviousPage()"
        (click)="table.previousPage()"
      >
        Previous
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanNextPage()"
        (click)="table.nextPage()"
      >
        Next
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
  host: { class: 'block w-full' },
})
export class ZardDemoDataTableRowSelectionComponent {
  readonly data = signal<Payment[]>(PAYMENTS);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    getRowId: row => row.id,
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  }));

  protected readonly hideableColumns = computed(() => this.table.getAllColumns().filter(column => column.getCanHide()));

  protected readonly emailFilter = computed(() => (this.table.getColumn('email')?.getFilterValue() as string) ?? '');

  protected filterEmails(event: Event): void {
    this.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
  }
}
```

## Reusable Components

The parts most data tables need come with the component. The [Faceted Filters](#faceted-filters) example below uses all three, with the features object shared the same way as in [Set up Table Features](#set-up-table-features).
- **`z-data-table-column-header`** makes a header sortable and hideable, and pinnable when the table has `columnPinningFeature`. It reads its column from DI, so render it from the column definition.
- **`z-data-table-pagination`** adds the selection count, a rows-per-page select, the page indicator and first, previous, next and last buttons.
- **`z-data-table-view-options`** is a "View" dropdown that toggles the hideable columns.

### Column Header

```angular-ts
columnHelper.accessor('email', {
  header: () => flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle: 'Email' } }),
}),
```

### Pagination Component

```angular-html
<z-data-table [zTable]="table" />
<z-data-table-pagination [zTable]="table" [zPageSizeOptions]="[10, 20, 50]" />
```

### View Options

```angular-html
<div class="flex items-center py-4">
  <z-data-table-view-options [zTable]="table" />
</div>
```

## Expandable Rows

With `rowExpandingFeature`, pass an `ng-template` to `[zExpandedRow]`: it renders in a full-width row under each expanded row, with the row as `let-row`. `getRowCanExpand` decides which rows can open.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import {
  createColumnHelper,
  flexRenderComponent,
  injectTable,
  injectTableCellContext,
  rowExpandingFeature,
  tableFeatures,
} from '@tanstack/angular-table';

import { ZardButtonComponent } from '@/shared/components/button';
import { type ZardDataTableColumnMeta, ZardDataTableImports } from '@/shared/components/data-table';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  date: string;
  status: 'paid' | 'shipped' | 'refunded';
  items: OrderItem[];
}

const ORDERS: Order[] = [
  {
    id: 'ORD-1042',
    customer: 'Olivia Martin',
    date: '2026-11-02',
    status: 'shipped',
    items: [
      { name: 'Mechanical Keyboard', quantity: 1, price: 129.99 },
      { name: 'USB-C Hub', quantity: 2, price: 49.99 },
    ],
  },
  {
    id: 'ORD-1043',
    customer: 'Jackson Lee',
    date: '2026-11-04',
    status: 'paid',
    items: [{ name: 'Wireless Mouse', quantity: 1, price: 29.99 }],
  },
  {
    id: 'ORD-1044',
    customer: 'Isabella Nguyen',
    date: '2026-11-07',
    status: 'refunded',
    items: [
      { name: '27" Monitor', quantity: 1, price: 349 },
      { name: 'Monitor Arm', quantity: 1, price: 89.5 },
      { name: 'HDMI Cable', quantity: 2, price: 12 },
    ],
  },
  {
    id: 'ORD-1045',
    customer: 'William Kim',
    date: '2026-11-09',
    status: 'paid',
    items: [{ name: 'Laptop Stand', quantity: 1, price: 59 }],
  },
];

const features = tableFeatures({
  rowExpandingFeature,
  columnMeta: {} as ZardDataTableColumnMeta,
});

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const totalOf = (order: Order) => order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

/** The chevron that opens and closes the row's detail. */
@Component({
  selector: 'z-demo-order-expand-toggle',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <button
      type="button"
      z-button
      zType="ghost"
      zSize="icon"
      class="size-8"
      [attr.aria-expanded]="cell().row.getIsExpanded()"
      [attr.aria-label]="(cell().row.getIsExpanded() ? 'Collapse ' : 'Expand ') + cell().row.original.id"
      (click)="cell().row.toggleExpanded()"
    >
      <ng-icon
        name="lucideChevronRight"
        class="transition-transform rtl:rotate-180"
        [class.rotate-90]="cell().row.getIsExpanded()"
        aria-hidden="true"
      />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight })],
})
export class OrderExpandToggleComponent {
  protected readonly cell = injectTableCellContext<typeof features, Order, unknown>();
}

const columnHelper = createColumnHelper<typeof features, Order>();

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'expand',
    cell: () => flexRenderComponent(OrderExpandToggleComponent),
    meta: { cellClass: 'w-10' },
  }),
  columnHelper.accessor('id', { header: 'Order', meta: { cellClass: 'font-medium' } }),
  columnHelper.accessor('customer', { header: 'Customer' }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ getValue }) => getValue().charAt(0).toUpperCase() + getValue().slice(1),
  }),
  columnHelper.accessor(totalOf, {
    id: 'total',
    header: 'Total',
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },
  }),
]);

@Component({
  selector: 'z-demo-data-table-expandable',
  imports: [ZardDataTableImports],
  template: `
    <z-data-table [zTable]="table" [zExpandedRow]="detail" />

    <ng-template #detail let-row>
      <div class="bg-muted/30 px-12 py-3 text-sm">
        <p class="text-muted-foreground mb-2">Ordered on {{ row.original.date }}</p>
        <ul class="flex flex-col gap-1">
          @for (item of row.original.items; track item.name) {
            <li class="flex justify-between gap-4">
              <span>{{ item.quantity }} × {{ item.name }}</span>
              <span class="tabular-nums">{{ format(item.quantity * item.price) }}</span>
            </li>
          }
        </ul>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoDataTableExpandableComponent {
  readonly data = signal<Order[]>(ORDERS);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    getRowId: row => row.id,
    getRowCanExpand: () => true,
  }));

  protected format(value: number): string {
    return currency.format(value);
  }
}
```

## Faceted Filters

A toolbar in the style of a task list. Each filter is a popover of checkable options; the counts next to them come from `columnFacetingFeature` with `createFacetedUniqueValues()`, so they follow the other filters.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowDown,
  lucideArrowRight,
  lucideArrowUp,
  lucideCheck,
  lucideCircle,
  lucideCircleCheck,
  lucideCircleHelp,
  lucideCircleOff,
  lucideCirclePlus,
  lucideTimer,
  lucideX,
} from '@ng-icons/lucide';
import {
  type Column,
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  flexRenderComponent,
  injectTable,
  injectTableCellContext,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/angular-table';

import { ZardBadgeComponent } from '@/shared/components/badge';
import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCommandImports } from '@/shared/components/command';
import {
  type ZardDataTableColumnMeta,
  ZardDataTableColumnHeaderComponent,
  ZardDataTableImports,
} from '@/shared/components/data-table';
import { ZardInputComponent } from '@/shared/components/input';
import { ZardPopoverDirective } from '@/shared/components/popover';
import { ZardSeparatorComponent } from '@/shared/components/separator';

import { SelectAllRowsComponent, SelectRowComponent } from './row-selection';

interface Task {
  id: string;
  title: string;
  label: 'bug' | 'feature' | 'documentation';
  status: 'backlog' | 'todo' | 'in progress' | 'done' | 'canceled';
  priority: 'low' | 'medium' | 'high';
}

interface FilterOption {
  label: string;
  value: string;
  icon: string;
}

const STATUSES: FilterOption[] = [
  { value: 'backlog', label: 'Backlog', icon: 'lucideCircleHelp' },
  { value: 'todo', label: 'Todo', icon: 'lucideCircle' },
  { value: 'in progress', label: 'In Progress', icon: 'lucideTimer' },
  { value: 'done', label: 'Done', icon: 'lucideCircleCheck' },
  { value: 'canceled', label: 'Canceled', icon: 'lucideCircleOff' },
];

const PRIORITIES: FilterOption[] = [
  { value: 'low', label: 'Low', icon: 'lucideArrowDown' },
  { value: 'medium', label: 'Medium', icon: 'lucideArrowRight' },
  { value: 'high', label: 'High', icon: 'lucideArrowUp' },
];

const TITLES = [
  'You can not quantify the bus without parsing the neural SSL protocol',
  'Try to override the TCP firewall, maybe it will index the redundant panel',
  'Use the wireless RSS capacitor, then you can generate the solid state bandwidth',
  'The SMTP card is down, synthesize the open-source sensor so we can reboot the feed',
  'Navigating the alarm will not do anything, we need to transmit the virtual array',
  'Calculating the program will not do anything, we need to override the online port',
  'Parse the primary XSS circuit so we can hack the bluetooth monitor',
  'Compressing the system will not do anything, we need to back up the cross-platform pixel',
  'We need to bypass the neural USB interface',
  'I will connect the mobile matrix, that should copy the HDD panel',
  'Use the auxiliary TLS bus, then you can index the virtual microchip',
  'Generating the driver will not do anything, we need to quantify the wireless capacitor',
];

const LABELS: Task['label'][] = ['bug', 'feature', 'documentation'];

/** Deterministic sample tasks, so the demo looks the same on every render. */
const TASKS: Task[] = Array.from({ length: 36 }, (_, index) => ({
  id: `TASK-${8782 - index * 37}`,
  title: TITLES[index % TITLES.length],
  label: LABELS[(index * 7) % LABELS.length],
  status: STATUSES[(index * 3) % STATUSES.length].value as Task['status'],
  priority: PRIORITIES[(index * 5) % PRIORITIES.length].value as Task['priority'],
}));

const features = tableFeatures({
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  columnMeta: {} as ZardDataTableColumnMeta,
});

type TaskColumn = Column<typeof features, Task, unknown>;

const ICONS = {
  lucideArrowDown,
  lucideArrowRight,
  lucideArrowUp,
  lucideCheck,
  lucideCircle,
  lucideCircleCheck,
  lucideCircleHelp,
  lucideCircleOff,
  lucideCirclePlus,
  lucideTimer,
  lucideX,
};

/**
 * A popover of checkable options that filters one column. The counts come from the column's
 * faceted unique values, so they follow the other filters.
 */
@Component({
  selector: 'z-demo-data-table-faceted-filter',
  imports: [
    ZardButtonComponent,
    ZardBadgeComponent,
    ZardCommandImports,
    ZardPopoverDirective,
    ZardSeparatorComponent,
    NgIcon,
  ],
  template: `
    <button
      type="button"
      z-button
      zType="outline"
      zSize="sm"
      class="h-8 border-dashed"
      zPopover
      zAlign="start"
      [zContent]="content"
    >
      <ng-icon name="lucideCirclePlus" aria-hidden="true" />
      {{ title() }}
      @if (selected().size) {
        <z-separator zOrientation="vertical" class="mx-2 h-4" />
        <z-badge zType="secondary" class="rounded-sm px-1 font-normal lg:hidden">{{ selected().size }}</z-badge>
        <div class="hidden gap-1 lg:flex">
          @if (selected().size > 2) {
            <z-badge zType="secondary" class="rounded-sm px-1 font-normal">{{ selected().size }} selected</z-badge>
          } @else {
            @for (option of selectedOptions(); track option.value) {
              <z-badge zType="secondary" class="rounded-sm px-1 font-normal">{{ option.label }}</z-badge>
            }
          }
        </div>
      }
    </button>

    <ng-template #content>
      <z-command class="w-50" (zCommandSelected)="select($event.value)">
        <z-command-input [placeholder]="title()" />
        <z-command-list>
          <z-command-option-group zLabel="Options">
            @for (option of options(); track option.value) {
              <z-command-option [zLabel]="option.label" [zValue]="option.value">
                <span
                  data-slot="command-option-leading"
                  class="border-primary flex size-4 items-center justify-center rounded-sm border"
                  [class]="
                    selected().has(option.value) ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                  "
                >
                  <ng-icon name="lucideCheck" class="size-3.5" aria-hidden="true" />
                </span>
                <ng-icon
                  data-slot="command-option-leading"
                  [name]="option.icon"
                  class="text-muted-foreground"
                  aria-hidden="true"
                />
                @if (counts().get(option.value); as count) {
                  <span data-slot="command-option-trailing" class="ms-auto font-mono text-xs">{{ count }}</span>
                }
              </z-command-option>
            }
          </z-command-option-group>
          @if (selected().size) {
            <z-command-divider />
            <z-command-option zLabel="Clear filters" [zValue]="clearValue" class="justify-center text-center" />
          }
        </z-command-list>
      </z-command>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons(ICONS)],
})
export class DataTableFacetedFilterComponent {
  readonly column = input.required<TaskColumn | undefined>();
  readonly title = input.required<string>();
  readonly options = input.required<FilterOption[]>();

  protected readonly selected = computed(
    () => new Set((this.column()?.getFilterValue() as string[] | undefined) ?? []),
  );

  protected readonly selectedOptions = computed(() =>
    this.options().filter(option => this.selected().has(option.value)),
  );

  protected readonly counts = computed(() => this.column()?.getFacetedUniqueValues() ?? new Map<string, number>());

  /** A value no option uses, so the "Clear filters" row can't collide with one. */
  protected readonly clearValue = Symbol('clear');

  protected select(value: unknown): void {
    if (value === this.clearValue) {
      this.column()?.setFilterValue(undefined);
      return;
    }

    const next = new Set(this.selected());
    const option = value as string;
    if (next.has(option)) {
      next.delete(option);
    } else {
      next.add(option);
    }
    this.column()?.setFilterValue(next.size ? [...next] : undefined);
  }
}

/** Icon and label of a status or priority, looked up in its options. */
@Component({
  selector: 'z-demo-task-option-cell',
  imports: [NgIcon],
  template: `
    @if (option(); as option) {
      <div class="flex items-center gap-2 whitespace-nowrap">
        <ng-icon [name]="option.icon" class="text-muted-foreground size-4" aria-hidden="true" />
        <span>{{ option.label }}</span>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons(ICONS)],
})
export class TaskOptionCellComponent {
  readonly options = input.required<FilterOption[]>();

  private readonly cell = injectTableCellContext<typeof features, Task, unknown>();
  protected readonly option = computed(() => this.options().find(option => option.value === this.cell().getValue()));
}

/** The title, led by its label. */
@Component({
  selector: 'z-demo-task-title-cell',
  imports: [ZardBadgeComponent],
  template: `
    <div class="flex gap-2">
      <z-badge zType="outline" class="capitalize">{{ cell().row.original.label }}</z-badge>
      <span class="max-w-60 truncate font-medium xl:max-w-80">{{ cell().row.original.title }}</span>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskTitleCellComponent {
  protected readonly cell = injectTableCellContext<typeof features, Task, unknown>();
}

/** Keeps the rows whose value is one of the checked options. */
const inOptions = (row: { getValue: (id: string) => unknown }, id: string, value: string[]) =>
  value.includes(row.getValue(id) as string);

const columnHelper = createColumnHelper<typeof features, Task>();

const header = (zTitle: string) => () =>
  flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle } });

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: () => flexRenderComponent(SelectAllRowsComponent),
    cell: () => flexRenderComponent(SelectRowComponent),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('id', {
    header: header('Task'),
    meta: { cellClass: 'w-20 whitespace-nowrap' },
    enableHiding: false,
  }),
  columnHelper.accessor('title', {
    header: header('Title'),
    cell: () => flexRenderComponent(TaskTitleCellComponent),
  }),
  columnHelper.accessor('status', {
    header: header('Status'),
    cell: () => flexRenderComponent(TaskOptionCellComponent, { inputs: { options: STATUSES } }),
    filterFn: inOptions,
  }),
  columnHelper.accessor('priority', {
    header: header('Priority'),
    cell: () => flexRenderComponent(TaskOptionCellComponent, { inputs: { options: PRIORITIES } }),
    filterFn: inOptions,
  }),
]);

@Component({
  selector: 'z-demo-data-table-faceted-filters',
  imports: [ZardDataTableImports, ZardButtonComponent, ZardInputComponent, DataTableFacetedFilterComponent, NgIcon],
  template: `
    <div class="flex items-center justify-between gap-2 py-4">
      <div class="flex flex-1 flex-wrap items-center gap-2">
        <input
          z-input
          class="h-8 w-38 lg:w-62"
          placeholder="Filter tasks..."
          aria-label="Filter tasks"
          [value]="titleFilter()"
          (input)="filterTitles($event)"
        />
        <z-demo-data-table-faceted-filter title="Status" [column]="table.getColumn('status')" [options]="statuses" />
        <z-demo-data-table-faceted-filter
          title="Priority"
          [column]="table.getColumn('priority')"
          [options]="priorities"
        />
        @if (isFiltered()) {
          <button type="button" z-button zType="ghost" zSize="sm" class="h-8" (click)="table.resetColumnFilters()">
            Reset
            <ng-icon name="lucideX" aria-hidden="true" />
          </button>
        }
      </div>
      <z-data-table-view-options [zTable]="table" />
    </div>
    <z-data-table [zTable]="table" />
    <z-data-table-pagination class="py-4" [zTable]="table" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideX })],
  host: { class: 'block w-full' },
})
export class ZardDemoDataTableFacetedFiltersComponent {
  protected readonly statuses = STATUSES;
  protected readonly priorities = PRIORITIES;

  readonly data = signal<Task[]>(TASKS);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    getRowId: row => row.id,
  }));

  protected readonly isFiltered = computed(() => this.table.atoms.columnFilters.get().length > 0);
  protected readonly titleFilter = computed(() => (this.table.getColumn('title')?.getFilterValue() as string) ?? '');

  protected filterTitles(event: Event): void {
    this.table.getColumn('title')?.setFilterValue((event.target as HTMLInputElement).value);
  }
}
```

## Server-side Data

When the server pages, sorts and filters, set `manualPagination`, `manualSorting` and `manualFiltering`, keep that state in signals, and pass `rowCount`. An Angular `resource()` refetches when the state changes and cancels the request in flight; `[zLoading]` dims the rows meanwhile.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, linkedSignal, resource, signal } from '@angular/core';

import {
  type ColumnFiltersState,
  columnFilteringFeature,
  createColumnHelper,
  flexRenderComponent,
  injectTable,
  type PaginationState,
  rowPaginationFeature,
  rowSortingFeature,
  type SortingState,
  tableFeatures,
  type Updater,
} from '@tanstack/angular-table';

import {
  type ZardDataTableColumnMeta,
  ZardDataTableColumnHeaderComponent,
  ZardDataTableImports,
} from '@/shared/components/data-table';
import { ZardInputComponent } from '@/shared/components/input';

import type { Payment } from './payments';

interface PaymentsQuery {
  pageIndex: number;
  pageSize: number;
  sorting: SortingState;
  email: string;
}

interface PaymentsPage {
  rows: Payment[];
  total: number;
}

const STATUSES: Payment['status'][] = ['success', 'processing', 'failed', 'pending'];

/** 200 payments standing in for a database table. */
const DATABASE: Payment[] = Array.from({ length: 200 }, (_, index) => ({
  id: `pay_${(index + 1).toString().padStart(4, '0')}`,
  amount: ((index * 7919) % 990) + 10,
  status: STATUSES[(index * 3) % STATUSES.length],
  email: `customer${((index * 37) % 200) + 1}@example.com`,
}));

/**
 * Stands in for `GET /api/payments?page=…&size=…&sort=…&email=…`: the server filters, sorts and
 * slices, and answers with one page and the total. Swap it for an `HttpClient` call.
 */
function fetchPayments(query: PaymentsQuery, abortSignal: AbortSignal): Promise<PaymentsPage> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      let rows = DATABASE.filter(payment => payment.email.includes(query.email.toLowerCase()));

      const [sort] = query.sorting;
      if (sort) {
        const key = sort.id as keyof Payment;
        rows = [...rows].sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * (sort.desc ? -1 : 1));
      }

      const start = query.pageIndex * query.pageSize;
      resolve({ rows: rows.slice(start, start + query.pageSize), total: rows.length });
    }, 400);

    abortSignal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(abortSignal.reason);
    });
  });
}

/** Applies a TanStack updater (a value or a function of the previous value) to a signal. */
function apply<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function' ? (updater as (old: T) => T)(previous) : updater;
}

const features = tableFeatures({
  columnFilteringFeature,
  rowPaginationFeature,
  rowSortingFeature,
  columnMeta: {} as ZardDataTableColumnMeta,
});

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const columnHelper = createColumnHelper<typeof features, Payment>();

const columns = columnHelper.columns([
  columnHelper.accessor('id', { header: 'Payment', enableSorting: false, meta: { cellClass: 'font-mono text-xs' } }),
  columnHelper.accessor('status', {
    header: () => flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle: 'Status' } }),
  }),
  columnHelper.accessor('email', {
    header: () => flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle: 'Email' } }),
  }),
  columnHelper.accessor('amount', {
    header: () => flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle: 'Amount' } }),
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { cellClass: 'font-medium' },
  }),
]);

@Component({
  selector: 'z-demo-data-table-server-side',
  imports: [ZardDataTableImports, ZardInputComponent],
  template: `
    <div class="flex items-center py-4">
      <input
        z-input
        class="max-w-sm"
        placeholder="Filter emails..."
        aria-label="Filter emails"
        (input.debounce.300)="filterEmails($event)"
      />
    </div>
    <z-data-table [zTable]="table" [zLoading]="payments.isLoading()" />
    <z-data-table-pagination class="py-4" [zTable]="table" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoDataTableServerSideComponent {
  readonly pagination = signal<PaginationState>({ pageIndex: 0, pageSize: 10 });
  readonly sorting = signal<SortingState>([]);
  readonly columnFilters = signal<ColumnFiltersState>([]);

  private readonly email = computed(
    () => (this.columnFilters().find(filter => filter.id === 'email')?.value as string | undefined) ?? '',
  );

  /** Refetches whenever the page, the sort or the filter changes, cancelling the request in flight. */
  readonly payments = resource({
    params: () => ({ ...this.pagination(), sorting: this.sorting(), email: this.email() }),
    loader: ({ params, abortSignal }) => fetchPayments(params, abortSignal),
  });

  /** The last page received, kept on screen while the next one loads. */
  private readonly page = linkedSignal<PaymentsPage | undefined, PaymentsPage>({
    source: () => this.payments.value(),
    computation: (value, previous) => value ?? previous?.value ?? { rows: [], total: 0 },
  });

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.page().rows,
    rowCount: this.page().total,
    getRowId: row => row.id,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    state: {
      pagination: this.pagination(),
      sorting: this.sorting(),
      columnFilters: this.columnFilters(),
    },
    onPaginationChange: updater => this.pagination.update(previous => apply(updater, previous)),
    onSortingChange: updater => this.sorting.update(previous => apply(updater, previous)),
    onColumnFiltersChange: updater => {
      this.columnFilters.update(previous => apply(updater, previous));
      this.pagination.update(previous => ({ ...previous, pageIndex: 0 }));
    },
  }));

  protected filterEmails(event: Event): void {
    this.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value || undefined);
  }
}
```

## Pinning and Resizing

With `columnPinningFeature`, pinned columns stay put while the rest scrolls; pin them in `initialState` or from the column header menu. With `columnSizingFeature` and `columnResizingFeature`, drag a header’s edge to resize it, or double-click it to reset. Pinning uses `start` and `end`, so it follows the reading direction.

```angular-ts
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  createColumnHelper,
  flexRenderComponent,
  injectTable,
  tableFeatures,
} from '@tanstack/angular-table';

import {
  type ZardDataTableColumnMeta,
  ZardDataTableColumnHeaderComponent,
  ZardDataTableImports,
} from '@/shared/components/data-table';

interface Employee {
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  startDate: string;
  salary: number;
}

const EMPLOYEES: Employee[] = [
  {
    name: 'Olivia Martin',
    email: 'olivia@example.com',
    role: 'Staff Engineer',
    department: 'Platform',
    location: 'Lisbon',
    startDate: '2021-03-15',
    salary: 168000,
  },
  {
    name: 'Jackson Lee',
    email: 'jackson@example.com',
    role: 'Product Designer',
    department: 'Design',
    location: 'Toronto',
    startDate: '2022-07-01',
    salary: 124000,
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella@example.com',
    role: 'Engineering Manager',
    department: 'Payments',
    location: 'Berlin',
    startDate: '2019-11-04',
    salary: 182000,
  },
  {
    name: 'William Kim',
    email: 'will@example.com',
    role: 'Data Analyst',
    department: 'Growth',
    location: 'Seoul',
    startDate: '2023-01-09',
    salary: 98000,
  },
  {
    name: 'Sofia Davis',
    email: 'sofia@example.com',
    role: 'Frontend Engineer',
    department: 'Platform',
    location: 'São Paulo',
    startDate: '2024-05-20',
    salary: 115000,
  },
];

const features = tableFeatures({
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnMeta: {} as ZardDataTableColumnMeta,
});

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const columnHelper = createColumnHelper<typeof features, Employee>();

const header = (zTitle: string) => () =>
  flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle } });

const columns = columnHelper.columns([
  columnHelper.accessor('name', { header: header('Name'), size: 180, meta: { cellClass: 'font-medium' } }),
  columnHelper.accessor('email', { header: header('Email'), size: 220 }),
  columnHelper.accessor('role', { header: header('Role'), size: 200 }),
  columnHelper.accessor('department', { header: header('Department'), size: 160 }),
  columnHelper.accessor('location', { header: header('Location'), size: 160 }),
  columnHelper.accessor('startDate', { header: header('Start date'), size: 150 }),
  columnHelper.accessor('salary', {
    header: header('Salary'),
    size: 140,
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { cellClass: 'tabular-nums' },
  }),
]);

@Component({
  selector: 'z-demo-data-table-pinning-resizing',
  imports: [ZardDataTableImports],
  template: `
    <z-data-table [zTable]="table" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoDataTablePinningResizingComponent {
  readonly data = signal<Employee[]>(EMPLOYEES);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    columnResizeMode: 'onChange',
    initialState: { columnPinning: { start: ['name'], end: ['salary'] } },
  }));
}
```

## RTL

To enable RTL support in zard/ui, see the [RTL configuration guide](/docs/rtl).

```angular-ts
// You will notice this example is rendered inside a wrapper that sets the dir and data-lang attributes, and
// reads its text from a translations helper. This is because this site is not RTL by default.
// In your application you won't need either: set dir="rtl" on <html> (or use the CDK Dir directive on a subtree)
// and write the text of your own language. See the RTL guide: https://zardui.com/docs/rtl

import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpDown, lucideChevronDown, lucideEllipsis } from '@ng-icons/lucide';
import {
  createColumnHelper,
  flexRenderComponent,
  injectTable,
  injectTableCellContext,
  injectTableContext,
  injectTableHeaderContext,
} from '@tanstack/angular-table';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardCheckboxComponent } from '@/shared/components/checkbox';
import { ZardDataTableImports } from '@/shared/components/data-table';
import { ZardDropdownImports } from '@/shared/components/dropdown';
import { ZardInputComponent } from '@/shared/components/input';
import { injectRtlTranslation, type ZardRtlTranslations } from '@/shared/demo-utils/rtl-translation';

import { type DataTableFeatures, features } from './features';
import { type Payment, PAYMENTS } from './payments';

const translations: ZardRtlTranslations<{
  filterEmails: string;
  columns: string;
  status: string;
  email: string;
  amount: string;
  actions: string;
  copyPaymentId: string;
  viewCustomer: string;
  viewPaymentDetails: string;
  selectAll: string;
  selectRow: string;
  openMenu: string;
  noResults: string;
  rowsSelected: string;
  rowsSelectedSuffix: string;
  previous: string;
  next: string;
  statuses: Record<Payment['status'], string>;
  locale: string;
}> = {
  en: {
    dir: 'ltr',
    values: {
      filterEmails: 'Filter emails...',
      columns: 'Columns',
      status: 'Status',
      email: 'Email',
      amount: 'Amount',
      actions: 'Actions',
      copyPaymentId: 'Copy payment ID',
      viewCustomer: 'View customer',
      viewPaymentDetails: 'View payment details',
      selectAll: 'Select all',
      selectRow: 'Select row',
      openMenu: 'Open menu',
      noResults: 'No results.',
      rowsSelected: 'of',
      rowsSelectedSuffix: 'row(s) selected.',
      previous: 'Previous',
      next: 'Next',
      statuses: { pending: 'Pending', processing: 'Processing', success: 'Success', failed: 'Failed' },
      locale: 'en-US',
    },
  },
  ar: {
    dir: 'rtl',
    values: {
      filterEmails: 'تصفية البريد الإلكتروني...',
      columns: 'الأعمدة',
      status: 'الحالة',
      email: 'البريد الإلكتروني',
      amount: 'المبلغ',
      actions: 'الإجراءات',
      copyPaymentId: 'نسخ معرف الدفع',
      viewCustomer: 'عرض العميل',
      viewPaymentDetails: 'عرض تفاصيل الدفع',
      selectAll: 'تحديد الكل',
      selectRow: 'تحديد الصف',
      openMenu: 'فتح القائمة',
      noResults: 'لا توجد نتائج.',
      rowsSelected: 'من',
      rowsSelectedSuffix: 'صف(وف) محدد.',
      previous: 'السابق',
      next: 'التالي',
      statuses: { pending: 'قيد الانتظار', processing: 'قيد المعالجة', success: 'ناجح', failed: 'فشل' },
      locale: 'ar-SA',
    },
  },
  he: {
    dir: 'rtl',
    values: {
      filterEmails: 'סנן אימיילים...',
      columns: 'עמודות',
      status: 'סטטוס',
      email: 'אימייל',
      amount: 'סכום',
      actions: 'פעולות',
      copyPaymentId: 'העתק מזהה תשלום',
      viewCustomer: 'צפה בלקוח',
      viewPaymentDetails: 'צפה בפרטי תשלום',
      selectAll: 'בחר הכל',
      selectRow: 'בחר שורה',
      openMenu: 'פתח תפריט',
      noResults: 'אין תוצאות.',
      rowsSelected: 'מתוך',
      rowsSelectedSuffix: 'שורות נבחרו.',
      previous: 'הקודם',
      next: 'הבא',
      statuses: { pending: 'ממתין', processing: 'מעבד', success: 'הצליח', failed: 'נכשל' },
      locale: 'he-IL',
    },
  },
};

/** Header checkbox, labelled in the selected language. */
@Component({
  selector: 'z-demo-rtl-select-all',
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <z-checkbox
      [ngModel]="table().getIsAllPageRowsSelected()"
      (ngModelChange)="table().toggleAllPageRowsSelected($event)"
    >
      <span class="sr-only">{{ i18n.t().selectAll }}</span>
    </z-checkbox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class RtlSelectAllComponent {
  protected readonly i18n = injectRtlTranslation(translations);
  protected readonly table = injectTableContext<DataTableFeatures, Payment>();
}

/** Row checkbox, labelled in the selected language. */
@Component({
  selector: 'z-demo-rtl-select-row',
  imports: [ZardCheckboxComponent, FormsModule],
  template: `
    <z-checkbox [ngModel]="cell().row.getIsSelected()" (ngModelChange)="cell().row.toggleSelected($event)">
      <span class="sr-only">{{ i18n.t().selectRow }}</span>
    </z-checkbox>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class RtlSelectRowComponent {
  protected readonly i18n = injectRtlTranslation(translations);
  protected readonly cell = injectTableCellContext<DataTableFeatures, Payment, unknown>();
}

/** Sortable email header. */
@Component({
  selector: 'z-demo-rtl-email-header',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <button type="button" z-button zType="ghost" class="-ms-2.5" (click)="toggle()">
      {{ i18n.t().email }}
      <ng-icon name="lucideArrowUpDown" aria-hidden="true" />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideArrowUpDown })],
})
class RtlEmailHeaderComponent {
  protected readonly i18n = injectRtlTranslation(translations);
  private readonly header = injectTableHeaderContext<DataTableFeatures, Payment, unknown>();

  protected toggle(): void {
    const { column } = this.header();
    column.toggleSorting(column.getIsSorted() === 'asc');
  }
}

/** Row actions menu. */
@Component({
  selector: 'z-demo-rtl-payment-actions',
  imports: [ZardButtonComponent, ZardDropdownImports, NgIcon],
  template: `
    <button type="button" z-button zType="ghost" zSize="icon" class="size-8" z-dropdown [zDropdownMenu]="menu">
      <span class="sr-only">{{ i18n.t().openMenu }}</span>
      <ng-icon name="lucideEllipsis" aria-hidden="true" />
    </button>
    <z-dropdown-menu-content #menu="zDropdownMenuContent" zAlign="end">
      <z-dropdown-menu-label>{{ i18n.t().actions }}</z-dropdown-menu-label>
      <z-dropdown-menu-item (click)="copyId()">{{ i18n.t().copyPaymentId }}</z-dropdown-menu-item>
      <z-dropdown-menu-separator />
      <z-dropdown-menu-item>{{ i18n.t().viewCustomer }}</z-dropdown-menu-item>
      <z-dropdown-menu-item>{{ i18n.t().viewPaymentDetails }}</z-dropdown-menu-item>
    </z-dropdown-menu-content>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideEllipsis })],
  host: { class: 'flex justify-end' },
})
class RtlPaymentActionsComponent {
  protected readonly i18n = injectRtlTranslation(translations);
  private readonly cell = injectTableCellContext<DataTableFeatures, Payment, unknown>();

  protected copyId(): void {
    void navigator.clipboard?.writeText(this.cell().row.original.id);
  }
}

const columnHelper = createColumnHelper<typeof features, Payment>();

@Component({
  selector: 'z-demo-data-table-rtl',
  imports: [ZardDataTableImports, ZardButtonComponent, ZardDropdownImports, ZardInputComponent, NgIcon],
  template: `
    <div class="flex items-center gap-2 py-4">
      <input
        z-input
        class="max-w-sm"
        [placeholder]="i18n.t().filterEmails"
        [attr.aria-label]="i18n.t().filterEmails"
        [value]="emailFilter()"
        (input)="filterEmails($event)"
      />
      <button type="button" z-button zType="outline" class="ms-auto" z-dropdown [zDropdownMenu]="columnsMenu">
        {{ i18n.t().columns }}
        <ng-icon name="lucideChevronDown" aria-hidden="true" />
      </button>
      <z-dropdown-menu-content #columnsMenu="zDropdownMenuContent" zAlign="end">
        @for (column of hideableColumns(); track column.id) {
          <z-dropdown-menu-checkbox-item
            class="capitalize"
            [zChecked]="column.getIsVisible()"
            (zCheckedChange)="column.toggleVisibility($event)"
          >
            {{ column.id }}
          </z-dropdown-menu-checkbox-item>
        }
      </z-dropdown-menu-content>
    </div>
    <z-data-table [zTable]="table" [zEmptyText]="i18n.t().noResults" />
    <div class="flex items-center justify-end gap-2 py-4">
      <div class="text-muted-foreground flex-1 text-sm">
        {{ table.getFilteredSelectedRowModel().rows.length }} {{ i18n.t().rowsSelected }}
        {{ table.getFilteredRowModel().rows.length }} {{ i18n.t().rowsSelectedSuffix }}
      </div>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanPreviousPage()"
        (click)="table.previousPage()"
      >
        {{ i18n.t().previous }}
      </button>
      <button
        type="button"
        z-button
        zType="outline"
        zSize="sm"
        [zDisabled]="!table.getCanNextPage()"
        (click)="table.nextPage()"
      >
        {{ i18n.t().next }}
      </button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronDown })],
  host: { class: 'block w-full' },
})
export class ZardDemoDataTableRtlComponent {
  protected readonly i18n = injectRtlTranslation(translations);

  /** Built once; the header and cell functions read the language when they render, so they follow it. */
  private readonly columns = columnHelper.columns([
    columnHelper.display({
      id: 'select',
      header: () => flexRenderComponent(RtlSelectAllComponent),
      cell: () => flexRenderComponent(RtlSelectRowComponent),
      enableSorting: false,
      enableHiding: false,
    }),
    columnHelper.accessor('status', {
      header: () => this.i18n.t().status,
      cell: ({ getValue }) => this.i18n.t().statuses[getValue()],
    }),
    columnHelper.accessor('email', {
      header: () => flexRenderComponent(RtlEmailHeaderComponent),
      meta: { cellClass: 'lowercase' },
    }),
    columnHelper.accessor('amount', {
      header: () => this.i18n.t().amount,
      cell: ({ getValue }) =>
        new Intl.NumberFormat(this.i18n.t().locale, { style: 'currency', currency: 'USD' }).format(getValue()),
      meta: { cellClass: 'font-medium' },
    }),
    columnHelper.display({
      id: 'actions',
      cell: () => flexRenderComponent(RtlPaymentActionsComponent),
      enableHiding: false,
    }),
  ]);

  readonly data = signal<Payment[]>(PAYMENTS.slice(0, 5));

  readonly table = injectTable(() => ({
    features,
    columns: this.columns,
    data: this.data(),
    getRowId: row => row.id,
  }));

  protected readonly hideableColumns = computed(() => this.table.getAllColumns().filter(column => column.getCanHide()));

  protected readonly emailFilter = computed(() => (this.table.getColumn('email')?.getFilterValue() as string) ?? '');

  protected filterEmails(event: Event): void {
    this.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
  }
}
```

## API Reference

### z-data-table

Renders the header groups and the current row model of a TanStack table with `z-table`, through `FlexRender`. It follows the features the table declares: selected rows get `data-state="selected"`, `columnSizingFeature` sets the column widths and adds resize handles with `columnResizingFeature`, and `columnPinningFeature` makes pinned columns sticky (pinning more than one column per side needs `columnSizingFeature`, which knows their widths). Column `meta.headerClass` and `meta.cellClass` (`ZardDataTableColumnMeta`) go on the column’s `th` and `td`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zTable]` | The table instance returned by `injectTable` | `AngularTable<TFeatures, TData>` | `—` |
| `[zExpandedRow]` | Template rendered in a full-width row under each expanded row (`rowExpandingFeature`); the row is `let-row` | `TemplateRef<ZardDataTableExpandedRowContext>` | `—` |
| `[zLoading]` | Dims the rows and sets `aria-busy` while data loads | `boolean` | `false` |
| `[zLoadingText]` | Text shown instead of `zEmptyText` while loading with no rows | `string` | `'Loading...'` |
| `[zEmptyText]` | Text shown when there are no rows | `string` | `'No results.'` |
| `[zTableClass]` | Classes for the inner `table[z-table]` | `ClassValue` | `''` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-data-table-column-header

A header menu with Asc and Desc (`rowSortingFeature`), Pin to start, Pin to end and Unpin (`columnPinningFeature`), and Hide (`columnVisibilityFeature`) — each shows when the table has its feature. Render it from a column definition with `flexRenderComponent`; it reads the header from DI, so it takes no table input.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zTitle]` | The column title | `string` | `—` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-data-table-pagination

Selection count, rows-per-page select, page indicator and first/previous/next/last buttons. Needs the row pagination feature; the selection count shows when row selection is on.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zTable]` | The table instance returned by `injectTable` | `AngularTable<TFeatures, TData>` | `—` |
| `[zPageSizeOptions]` | Choices of the rows-per-page select | `number[]` | `[10, 20, 25, 30, 40, 50]` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### z-data-table-view-options

A "View" dropdown that toggles the hideable accessor columns. Needs the column visibility feature.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[zTable]` | The table instance returned by `injectTable` | `AngularTable<TFeatures, TData>` | `—` |
| `[zLabel]` | Trigger label | `string` | `'View'` |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/data-table)
