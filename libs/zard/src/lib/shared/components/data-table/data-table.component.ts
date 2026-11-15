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
