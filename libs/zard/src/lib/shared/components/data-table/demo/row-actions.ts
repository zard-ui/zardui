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
