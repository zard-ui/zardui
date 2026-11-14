import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { createColumnHelper, injectTable } from '@tanstack/angular-table';

import { ZardDataTableImports } from '@/shared/components/data-table';

import { features } from './features';
import { type Payment, PAYMENTS } from './payments';

const columnHelper = createColumnHelper<typeof features, Payment>();

const columns = columnHelper.columns([
  columnHelper.accessor('status', { header: 'Status' }),
  columnHelper.accessor('email', { header: 'Email' }),
  columnHelper.accessor('amount', { header: 'Amount' }),
]);

@Component({
  selector: 'z-demo-data-table-basic',
  imports: [ZardDataTableImports],
  template: `
    <z-data-table [zTable]="table" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoDataTableBasicComponent {
  readonly data = signal<Payment[]>(PAYMENTS);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
  }));
}
