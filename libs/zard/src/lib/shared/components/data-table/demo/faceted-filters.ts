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
