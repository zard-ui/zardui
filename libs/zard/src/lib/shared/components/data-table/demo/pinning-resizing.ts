import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import {
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  createColumnHelper,
  flexRenderComponent,
  injectTable,
  tableFeatures,
} from '@tanstack/angular-table';

import {
  type ZardDataTableColumnMeta,
  ZardDataTableColumnHeaderComponent,
  ZardDataTableImports,
} from '@/shared/components/data-table';

interface Employee {
  name: string;
  email: string;
  role: string;
  department: string;
  location: string;
  startDate: string;
  salary: number;
}

const EMPLOYEES: Employee[] = [
  {
    name: 'Olivia Martin',
    email: 'olivia@example.com',
    role: 'Staff Engineer',
    department: 'Platform',
    location: 'Lisbon',
    startDate: '2021-03-15',
    salary: 168000,
  },
  {
    name: 'Jackson Lee',
    email: 'jackson@example.com',
    role: 'Product Designer',
    department: 'Design',
    location: 'Toronto',
    startDate: '2022-07-01',
    salary: 124000,
  },
  {
    name: 'Isabella Nguyen',
    email: 'isabella@example.com',
    role: 'Engineering Manager',
    department: 'Payments',
    location: 'Berlin',
    startDate: '2019-11-04',
    salary: 182000,
  },
  {
    name: 'William Kim',
    email: 'will@example.com',
    role: 'Data Analyst',
    department: 'Growth',
    location: 'Seoul',
    startDate: '2023-01-09',
    salary: 98000,
  },
  {
    name: 'Sofia Davis',
    email: 'sofia@example.com',
    role: 'Frontend Engineer',
    department: 'Platform',
    location: 'São Paulo',
    startDate: '2024-05-20',
    salary: 115000,
  },
];

const features = tableFeatures({
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnMeta: {} as ZardDataTableColumnMeta,
});

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const columnHelper = createColumnHelper<typeof features, Employee>();

const header = (zTitle: string) => () =>
  flexRenderComponent(ZardDataTableColumnHeaderComponent, { inputs: { zTitle } });

const columns = columnHelper.columns([
  columnHelper.accessor('name', { header: header('Name'), size: 180, meta: { cellClass: 'font-medium' } }),
  columnHelper.accessor('email', { header: header('Email'), size: 220 }),
  columnHelper.accessor('role', { header: header('Role'), size: 200 }),
  columnHelper.accessor('department', { header: header('Department'), size: 160 }),
  columnHelper.accessor('location', { header: header('Location'), size: 160 }),
  columnHelper.accessor('startDate', { header: header('Start date'), size: 150 }),
  columnHelper.accessor('salary', {
    header: header('Salary'),
    size: 140,
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { cellClass: 'tabular-nums' },
  }),
]);

@Component({
  selector: 'z-demo-data-table-pinning-resizing',
  imports: [ZardDataTableImports],
  template: `
    <z-data-table [zTable]="table" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoDataTablePinningResizingComponent {
  readonly data = signal<Employee[]>(EMPLOYEES);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    columnResizeMode: 'onChange',
    initialState: { columnPinning: { start: ['name'], end: ['salary'] } },
  }));
}
