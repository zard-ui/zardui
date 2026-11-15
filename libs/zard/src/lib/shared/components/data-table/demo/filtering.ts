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
