import { ChangeDetectionStrategy, Component, computed, effect, input, output, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs';
import { ZardButtonComponent, ZardInputDirective } from '../components';
import { TableState, ZardTableDataSource } from './table';
import { ZardTableSortIconComponent } from './table-sort-icon.component';
import { ZardTableModule } from './table.module';
import { ZardTableService } from './table.service';

@Component({
  selector: 'z-table',
  exportAs: 'zTable',
  imports: [ZardTableModule, ZardButtonComponent, ZardTableSortIconComponent, ZardInputDirective, ReactiveFormsModule],
  providers: [ZardTableService],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    @if (filtering()) {
      <div z-table-filtering role="search">
        <label for="inputSearch" class="sr-only">{{ inputPlaceholder() }}</label>
        <input z-input type="text" [placeholder]="inputPlaceholder()" [formControl]="searchControl" id="inputSearch" />
      </div>
    }
    <div z-table-wrapper>
      <table z-table role="table">
        @if (columns().length && dataSource().data.length) {
          <thead>
            <tr z-tr>
              @for (column of columns(); track column.accessor) {
                @if (column.sortable) {
                  <th z-th scope="col" sortable (click)="toggleSort(column.accessor)" tabindex="0" role="button" [attr.aria-label]="'Sort by ' + column.header">
                    {{ column.header }}
                    <z-table-sort-icon [direction]="sortDirectionMap()[column.accessor]"></z-table-sort-icon>
                  </th>
                } @else {
                  <th z-th scope="col">
                    {{ column.header }}
                  </th>
                }
              }
            </tr>
          </thead>

          <tbody>
            @for (row of dataSource().data; track row) {
              <tr z-tr>
                @for (column of columns(); track column.accessor) {
                  <td z-td>{{ row[column.accessor] }}</td>
                }
              </tr>
            }
          </tbody>
        } @else {
          <ng-content></ng-content>
        }
      </table>
    </div>

    @if (pagination()) {
      <div z-table-pagination>
        <button z-button zType="outline" zSize="sm" (click)="goPrev()" [disabled]="disablePrev()">Previous</button>
        <button z-button zType="outline" zSize="sm" (click)="goNext()" [disabled]="disableNext()">Next</button>
      </div>
    }
  `,
  host: {
    '[class.z-ordering-enabled]': 'zOrdering()',
  },
  styles: [
    `
      th[sortable]:hover {
        cursor: pointer;
      }
    `,
  ],
})
export class ZardTableComponent {
  readonly columns = input<{ header: string; accessor: string; sortable?: boolean; filterable?: boolean }[]>([]);
  readonly dataSource = input<ZardTableDataSource<Record<string, string | number>>>({ data: [] });

  readonly pagination = input<boolean>();
  readonly disableNext = computed(() => !this.tableService.hasNextPage());
  readonly disablePrev = computed(() => !this.tableService.hasPrevPage());

  readonly zOrdering = input<boolean>(false);
  readonly direction = computed(() => this.tableService.tableState().direction);
  readonly sortField = computed(() => this.tableService.tableState().field);
  readonly sortDirectionMap = computed(() => ({ [this.sortField() ?? '']: this.direction() ?? null }));

  readonly filtering = input<boolean>(false);
  readonly searchControl = new FormControl();

  readonly filterableColumns = computed(() => this.columns().filter(col => col.filterable));

  readonly inputPlaceholder = computed(
    () =>
      `Filter by ${this.filterableColumns()
        .map(col => col.header)
        .join(', ')}`,
  );

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

  goNext() {
    this.tableService.nextPage();
    this.stateChange.emit(this.tableService.tableState());
  }

  goPrev() {
    this.tableService.prevPage();
    this.stateChange.emit(this.tableService.tableState());
  }

  toggleSort(field: string) {
    if (this.zOrdering()) {
      this.tableService.setSorting(field);
      this.stateChange.emit(this.tableService.tableState());
    }
  }

  filter(searchItem: string) {
    if (this.filtering() && searchItem !== this.tableService.tableState().search) {
      this.tableService.setFiltering(searchItem ?? '');
      this.stateChange.emit(this.tableService.tableState());
    }
  }
}
