import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_includesString,
  flexRenderComponent,
  injectTable,
  rowPaginationFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
} from '@tanstack/angular-table';

import {
  type ZardDataTableColumnMeta,
  ZardDataTableColumnHeaderComponent,
  ZardDataTableImports,
} from '@zard/components/data-table';
import { ZardInputComponent } from '@zard/components/input/input.component';

import { ExampleImports } from './example.component';

interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
}

const PAYMENTS: Payment[] = [
  { id: 'm5gr84i9', amount: 316, status: 'success', email: 'ken99@example.com' },
  { id: '3u1reuv4', amount: 242, status: 'success', email: 'abe45@example.com' },
  { id: 'derv1ws0', amount: 837, status: 'processing', email: 'monserrat44@example.com' },
  { id: '5kma53ae', amount: 874, status: 'success', email: 'silas22@example.com' },
  { id: 'bhqecj4p', amount: 721, status: 'failed', email: 'carmella@example.com' },
  { id: 'p8x2kq7n', amount: 129, status: 'pending', email: 'lena.ortiz@example.com' },
  { id: 'z4m9d1rt', amount: 563, status: 'success', email: 'omar_h@example.com' },
  { id: 'c7v0w2yb', amount: 98, status: 'failed', email: 'june.park@example.com' },
];

const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: { includesString: filterFn_includesString },
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text },
  columnMeta: {} as ZardDataTableColumnMeta,
});

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const columnHelper = createColumnHelper<typeof features, Payment>();

const basicColumns = columnHelper.columns([
  columnHelper.accessor('status', { header: 'Status', meta: { cellClass: 'capitalize' } }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },
  }),
]);

const sortableColumns = columnHelper.columns([
  columnHelper.accessor('status', {
    header: () => flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle: 'Status' } }),
    meta: { cellClass: 'capitalize' },
  }),
  columnHelper.accessor('email', {
    header: () => flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle: 'Email' } }),
  }),
  columnHelper.accessor('amount', {
    header: () => flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle: 'Amount' } }),
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },
  }),
]);

/** The data table's demos, laid out as a `/create` example page. */
@Component({
  selector: 'z-data-table-example',
  imports: [ExampleImports, ZardDataTableImports, ZardInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <z-example-wrapper zClass="md:grid-cols-1 md:gap-12">
      <z-example zTitle="Basic">
        <z-data-table [zTable]="basicTable" />
      </z-example>

      <z-example zTitle="Sorting, Filtering and Pagination">
        <div class="flex flex-col gap-4 p-4">
          <div class="flex items-center gap-2">
            <input
              z-input
              class="max-w-sm"
              placeholder="Filter emails..."
              aria-label="Filter emails"
              (input)="filterEmails($event)"
            />
            <z-data-table-view-options [zTable]="fullTable" />
          </div>
          <z-data-table [zTable]="fullTable" />
          <z-data-table-pagination [zTable]="fullTable" [zPageSizeOptions]="[5, 10, 20]" />
        </div>
      </z-example>

      <z-example zTitle="Empty">
        <z-data-table [zTable]="emptyTable" />
      </z-example>
    </z-example-wrapper>
  `,
})
export class DataTableExampleComponent {
  protected readonly data = signal<Payment[]>(PAYMENTS);
  protected readonly empty = signal<Payment[]>([]);

  protected readonly basicTable = injectTable(() => ({
    features,
    columns: basicColumns,
    data: this.data().slice(0, 4),
  }));

  protected readonly fullTable = injectTable(() => ({
    features,
    columns: sortableColumns,
    data: this.data(),
    initialState: { pagination: { pageIndex: 0, pageSize: 5 } },
  }));

  protected readonly emptyTable = injectTable(() => ({
    features,
    columns: basicColumns,
    data: this.empty(),
  }));

  protected filterEmails(event: Event): void {
    this.fullTable.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
  }
}
