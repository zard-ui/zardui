import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { createColumnHelper, flexRenderComponent, injectTable } from '@tanstack/angular-table';

import { ZardButtonComponent } from '@/shared/components/button';
import { ZardDataTableImports } from '@/shared/components/data-table';
import { ZardDropdownImports } from '@/shared/components/dropdown';
import { ZardInputComponent } from '@/shared/components/input';

import { features } from './features';
import { type Payment, PAYMENTS } from './payments';
import { PaymentActionsComponent } from './row-actions';
import { SelectAllRowsComponent, SelectRowComponent } from './row-selection';
import { PaymentEmailHeaderComponent } from './sorting';

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const columnHelper = createColumnHelper<typeof features, Payment>();

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'select',
    header: () => flexRenderComponent(SelectAllRowsComponent),
    cell: () => flexRenderComponent(SelectRowComponent),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor('status', { header: 'Status', meta: { cellClass: 'capitalize' } }),
  columnHelper.accessor('email', {
    header: () => flexRenderComponent(PaymentEmailHeaderComponent),
    meta: { cellClass: 'lowercase' },
  }),
  columnHelper.accessor('amount', {
    header: 'Amount',
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },
  }),
  columnHelper.display({
    id: 'actions',
    cell: () => flexRenderComponent(PaymentActionsComponent),
    enableHiding: false,
  }),
]);

@Component({
  selector: 'z-demo-data-table-preview',
  imports: [ZardDataTableImports, ZardButtonComponent, ZardDropdownImports, ZardInputComponent, NgIcon],
  template: `
    <div class="flex items-center gap-2 py-4">
      <input
        z-input
        class="max-w-sm"
        placeholder="Filter emails..."
        aria-label="Filter emails"
        [value]="emailFilter()"
        (input)="filterEmails($event)"
      />
      <button type="button" z-button zType="outline" class="ms-auto" z-dropdown [zDropdownMenu]="columnsMenu">
        Columns
        <ng-icon name="lucideChevronDown" aria-hidden="true" />
      </button>
      <z-dropdown-menu-content #columnsMenu="zDropdownMenuContent" zAlign="end">
        @for (column of hideableColumns(); track column.id) {
          <z-dropdown-menu-checkbox-item
            class="capitalize"
            [zChecked]="column.getIsVisible()"
            (zCheckedChange)="column.toggleVisibility($event)"
          >
            {{ column.id }}
          </z-dropdown-menu-checkbox-item>
        }
      </z-dropdown-menu-content>
    </div>
    <z-data-table [zTable]="table" />
    <div class="flex items-center justify-end gap-2 py-4">
      <div class="text-muted-foreground flex-1 text-sm">
        {{ table.getFilteredSelectedRowModel().rows.length }} of {{ table.getFilteredRowModel().rows.length }} row(s)
        selected.
      </div>
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
  viewProviders: [provideIcons({ lucideChevronDown })],
  host: { class: 'block w-full' },
})
export class ZardDemoDataTablePreviewComponent {
  readonly data = signal<Payment[]>(PAYMENTS);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    getRowId: row => row.id,
  }));

  protected readonly hideableColumns = computed(() => this.table.getAllColumns().filter(column => column.getCanHide()));

  protected readonly emailFilter = computed(() => (this.table.getColumn('email')?.getFilterValue() as string) ?? '');

  protected filterEmails(event: Event): void {
    this.table.getColumn('email')?.setFilterValue((event.target as HTMLInputElement).value);
  }
}
