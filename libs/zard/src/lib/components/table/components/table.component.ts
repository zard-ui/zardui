import { ChangeDetectionStrategy, Component, computed, effect, forwardRef, InjectionToken, input, OnInit, output, Signal, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { mergeClasses } from '../../../shared/utils/utils';
import { TableState, ZardTableDataSource } from '../table';
import { ZardTableService } from '../table.service';
import { tableVariants } from './../table.variants';
import { ZardTableSortIconComponent } from './table-sort-icon.component';
import { ZardTableModule } from './table.module';

export type ZTableType = 'default' | 'striped' | 'bordered';
export type ZTableSize = 'default' | 'compact' | 'comfortable';

export const Z_TABLE_TYPE = new InjectionToken<Signal<ZTableType> | null>('Z_TABLE_TYPE');
export const Z_TABLE_SIZE = new InjectionToken<Signal<ZTableSize> | null>('Z_TABLE_SIZE');

@Component({
  selector: 'z-table',
  exportAs: 'zTable',
  imports: [ZardTableSortIconComponent, ReactiveFormsModule, ZardTableModule],
  providers: [
    ZardTableService,
    {
      provide: Z_TABLE_TYPE,
      useFactory: (self: ZardTableComponent) => self.zType,
      deps: [forwardRef(() => ZardTableComponent)],
    },
    {
      provide: Z_TABLE_SIZE,
      useFactory: (self: ZardTableComponent) => self.zSize,
      deps: [forwardRef(() => ZardTableComponent)],
    },
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="flex justify-between items-center w-full">
      <div class="min-w-[1px]">
        @if (enableFiltering()) {
          <z-table-filtering [placeholder]="inputPlaceholder()" [search]="searchSummary()" [control]="searchControl" [zSize]="zSize()"></z-table-filtering>
        }
      </div>

      <div class="min-w-[1px]">
        @if (enableColumnSelector()) {
          <z-table-column-selector [columns]="columns()" [visibleColumns]="visibleColumns()" (toggleColumn)="toggleShowColumns($event)" [zSize]="zSize()"></z-table-column-selector>
        }
      </div>
    </div>

    <div z-table-wrapper [zType]="zType()">
      <table role="table" id="table-id" [class]="tableClasses()">
        @if (columns().length) {
          <thead z-table-header [zType]="zType()">
            <tr z-table-row [zType]="zType()">
              @for (column of columns(); track column.accessor) {
                @if (visibleColumns()[column.accessor]) {
                  @if (column.sortable) {
                    <th z-table-head scope="col" sortable [zSize]="zSize()">
                      <span
                        class="hover:cursor-pointer"
                        (click)="toggleSort(column.accessor)"
                        (keydown.enter)="toggleSort(column.accessor)"
                        (keydown.space)="toggleSort(column.accessor); $event.preventDefault()"
                        tabindex="0"
                        role="button"
                        [attr.aria-label]="'Sort by ' + column.header + (sortDirectionMap()[column.accessor] ? ', ' + sortDirectionMap()[column.accessor] + ' order' : '')"
                        [attr.aria-sort]="sortDirectionMap()[column.accessor] ? sortDirectionMap()[column.accessor] : 'none'"
                      >
                        {{ column.header }}
                        <z-table-sort-icon [direction]="sortDirectionMap()[column.accessor]"></z-table-sort-icon>
                      </span>
                    </th>
                  } @else {
                    <th z-table-head scope="col" [zSize]="zSize()">
                      {{ column.header }}
                    </th>
                  }
                }
              }
            </tr>
          </thead>

          <tbody z-table-body [zType]="zType()">
            @if (dataSource().data.length) {
              @for (row of dataSource().data; track row) {
                <tr z-table-row [zType]="zType()">
                  @for (column of columns(); track column.accessor) {
                    @if (visibleColumns()[column.accessor]) {
                      <td z-table-cell>
                        {{ row[column.accessor] }}
                      </td>
                    }
                  }
                </tr>
              }
            } @else {
              <tr z-table-row>
                <td z-table-cell [attr.colspan]="columns().length" class="h-24 text-center">No results found</td>
              </tr>
            }
          </tbody>
        } @else {
          <ng-content></ng-content>
        }
      </table>

      <div aria-live="polite" class="sr-only">Table sorted by {{ sortField() }} in {{ direction() }} order</div>
    </div>

    @if (enablePagination()) {
      <z-table-pagination [pageSummary]="pageSummary()" [disableNext]="disableNext()" [disablePrev]="disablePrev()" (prev)="goPrev()" (next)="goNext()"></z-table-pagination>
    }
  `,
})
export class ZardTableComponent implements OnInit {
  readonly columns = input<{ header: string; accessor: string; sortable?: boolean; filterable?: boolean }[]>([]);
  readonly dataSource = input<ZardTableDataSource<Record<string, string | number>>>({ data: [] });

  readonly zType = input<'default' | 'striped' | 'bordered'>('default');
  readonly zSize = input<'default' | 'compact' | 'comfortable'>('default');

  readonly tableClasses = computed(() => mergeClasses(tableVariants.table({ zSize: this.zSize(), zType: this.zType() })));

  readonly enablePagination = input<boolean>();
  readonly disableNext = computed(() => !this.tableService.hasNextPage());
  readonly disablePrev = computed(() => !this.tableService.hasPrevPage());

  readonly enableOrdering = input<boolean>(false);
  readonly direction = computed(() => this.tableService.tableState().direction);
  readonly sortField = computed(() => this.tableService.tableState().field);
  readonly sortDirectionMap = computed(() => ({ [this.sortField() ?? '']: this.direction() ?? null }));

  readonly enableFiltering = input<boolean>(false);
  readonly searchControl = new FormControl();
  readonly filterableColumns = computed(() => this.columns().filter(col => col.filterable));
  readonly inputPlaceholder = computed(
    () =>
      `Filter by ${this.filterableColumns()
        .map(col => col.header)
        .join(', ')}`,
  );

  readonly searchSummary = computed(() => {
    const { search, totalItems } = this.tableService.tableState();
    return search ? `${totalItems} resultados encontrados` : 'Nenhum filtro aplicado';
  });

  readonly pageSummary = computed(() => {
    return `Page ${this.tableService.currentPage()} of ${this.tableService.totalPages()}`;
  });

  readonly enableColumnSelector = input<boolean>(false);
  readonly visibleColumns = computed(() => this.tableService.visibleColumns());

  readonly stateChange = output<TableState>();

  constructor(private readonly tableService: ZardTableService) {
    effect(() => {
      const meta = this.dataSource().meta;

      if (meta) {
        this.tableService.updateState({
          ...meta.pagination,
          ...meta.sorting,
          ...meta.filtering,
        });
      }
    });

    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(query => {
      this.filter(query);
    });
  }

  ngOnInit() {
    this.tableService.setInitialVisibleColumns(this.columns().map(c => c.accessor));
  }

  goNext() {
    this.tableService.nextPage();
    this.stateChange.emit(this.tableService.tableState());
  }

  goPrev() {
    this.tableService.prevPage();
    this.stateChange.emit(this.tableService.tableState());
  }

  toggleSort(field: string) {
    if (this.enableOrdering()) {
      this.tableService.setSorting(field);
      this.stateChange.emit(this.tableService.tableState());
    }
  }

  filter(searchItem: string) {
    if (this.enableFiltering() && searchItem !== this.tableService.tableState().search) {
      this.tableService.setFiltering(searchItem ?? '');
      this.stateChange.emit(this.tableService.tableState());
    }
  }

  toggleShowColumns(accessor: string) {
    this.tableService.toggleColumn(accessor);
  }
}
