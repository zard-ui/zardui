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
