import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  input,
  OnInit,
  output,
  QueryList,
  signal,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
} from '@angular/core';
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
    <div z-toolbar>
      <div z-toolbar-item>
        @if (filtering()) {
          <div z-table-filtering role="search">
            <label for="inputSearch" class="sr-only">{{ inputPlaceholder() }}</label>
            <input z-input type="text" zSize="default" class="w-full min-w-0 max-w-sm" [placeholder]="inputPlaceholder()" [formControl]="searchControl" id="inputSearch" />
          </div>
        }
      </div>

      <div z-toolbar-item>
        @if (enableColumnSelector()) {
          <details #detailsRef z-details (toggle)="onDetailsToggle($event)">
            <summary #summaryRef z-summary role="button" tabindex="0" aria-haspopup="menu" [attr.aria-expanded]="isDetailsOpen()" aria-controls="dropdown-list-id">
              Columns
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-chevron-down-icon lucide-chevron-down"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </summary>

            <ul tabindex="-1" z-dropdown-ul role="menu" id="dropdown-list-id" aria-orientation="vertical" (keydown)="onMenuKeydown($event)">
              @for (column of columns(); track column.accessor) {
                <li z-dropdown-li role="none">
                  <label for="{{ column.accessor }}" z-dropdown-li-label role="menuitemcheckbox" [attr.aria-checked]="visibleColumns()[column.accessor]" tabindex="-1">
                    <input
                      #firstCheckbox
                      #checkboxInputs
                      tabindex="-1"
                      z-dropdown-checkbox
                      type="checkbox"
                      id="{{ column.accessor }}"
                      name="{{ column.accessor }}"
                      [checked]="visibleColumns()[column.accessor]"
                      (change)="toggleShowColumns(column.accessor)"
                      (keydown)="onCheckboxKeydown($event, column.accessor)"
                    />
                    <span z-dropdown-check-icon-wrapper>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="lucide lucide-check-icon lucide-check"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </span>
                    {{ column.header }}
                  </label>
                </li>
              }
            </ul>
          </details>
        }
      </div>
    </div>
    <div z-table-wrapper>
      <table z-table role="table">
        @if (columns().length && dataSource().data.length) {
          <thead>
            <tr z-tr>
              @for (column of columns(); track column.accessor) {
                @if (column.sortable) {
                  <th
                    z-th
                    scope="col"
                    sortable
                    (click)="toggleSort(column.accessor)"
                    tabindex="0"
                    role="button"
                    [attr.aria-label]="'Sort by ' + column.header"
                    [style.display]="visibleColumns()[column.accessor] ? 'table-cell' : 'none'"
                  >
                    {{ column.header }}
                    <z-table-sort-icon [direction]="sortDirectionMap()[column.accessor]"></z-table-sort-icon>
                  </th>
                } @else {
                  <th z-th scope="col" [style.display]="visibleColumns()[column.accessor] ? 'table-cell' : 'none'">
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
                  <td z-td [style.display]="visibleColumns()[column.accessor] ? 'table-cell' : 'none'">
                    {{ row[column.accessor] }}
                  </td>
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
export class ZardTableComponent implements OnInit {
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

  readonly enableColumnSelector = input<boolean>(false);
  readonly visibleColumns = computed(() => this.tableService.visibleColumns());
  readonly isDetailsOpen = signal(false);

  readonly stateChange = output<TableState>();

  @ViewChild('detailsRef') detailsElementRef!: ElementRef<HTMLDetailsElement>;
  @ViewChild('summaryRef') summaryElementRef!: ElementRef<HTMLElement>;
  @ViewChildren('checkboxInputs', { read: ElementRef }) checkboxInputs!: QueryList<ElementRef<HTMLInputElement>>;
  @ViewChildren('firstCheckbox') checkboxes!: QueryList<ElementRef<HTMLInputElement>>;
  firstCheckbox!: ElementRef<HTMLInputElement>;

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

  toggleShowColumns(accessor: string) {
    this.tableService.toggleColumn(accessor);
    this.closeDetails();
    this.summaryElementRef?.nativeElement?.focus();
  }

  onCheckboxKeydown(event: KeyboardEvent, accessor: string) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.toggleShowColumns(accessor);
    }
  }

  onDetailsToggle(event: Event) {
    const detailsElement = event.target as HTMLDetailsElement;
    this.isDetailsOpen.set(detailsElement.open);

    if (detailsElement.open) {
      requestAnimationFrame(() => {
        this.checkboxes.first?.nativeElement.focus();
      });
    }
  }

  private isDetailsOpenAndAvailable(): boolean {
    const details = this.detailsElementRef?.nativeElement;
    return details && details.open;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isDetailsOpenAndAvailable()) {
      this.closeDetails();
      this.summaryElementRef?.nativeElement?.focus();
    }
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    const details = this.detailsElementRef?.nativeElement;
    if (this.isDetailsOpenAndAvailable() && !details.contains(event.target as Node)) {
      this.closeDetails();
    }
  }

  @HostListener('document:focusout', ['$event'])
  onFocusOut(event: FocusEvent) {
    const details = this.detailsElementRef?.nativeElement;
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    if (this.isDetailsOpenAndAvailable() && (!relatedTarget || !details.contains(relatedTarget))) {
      this.closeDetails();
    }
  }

  closeDetails() {
    const details = this.detailsElementRef?.nativeElement;
    if (details && details.open) {
      details.open = false;
      this.isDetailsOpen.set(false);
    }
  }

  onMenuKeydown(event: KeyboardEvent) {
    const inputs = this.checkboxInputs.toArray();
    const currentIndex = inputs.findIndex(input => input.nativeElement === document.activeElement);

    if (event.key === 'Tab') {
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % inputs.length;
      inputs[nextIndex].nativeElement.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (currentIndex - 1 + inputs.length) % inputs.length;
      inputs[prevIndex].nativeElement.focus();
    }
  }
}
