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
