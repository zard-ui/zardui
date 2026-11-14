import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import {
  createColumnHelper,
  flexRenderComponent,
  injectTable,
  injectTableCellContext,
  rowExpandingFeature,
  tableFeatures,
} from '@tanstack/angular-table';

import { ZardButtonComponent } from '@/shared/components/button';
import { type ZardDataTableColumnMeta, ZardDataTableImports } from '@/shared/components/data-table';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  customer: string;
  date: string;
  status: 'paid' | 'shipped' | 'refunded';
  items: OrderItem[];
}

const ORDERS: Order[] = [
  {
    id: 'ORD-1042',
    customer: 'Olivia Martin',
    date: '2026-11-02',
    status: 'shipped',
    items: [
      { name: 'Mechanical Keyboard', quantity: 1, price: 129.99 },
      { name: 'USB-C Hub', quantity: 2, price: 49.99 },
    ],
  },
  {
    id: 'ORD-1043',
    customer: 'Jackson Lee',
    date: '2026-11-04',
    status: 'paid',
    items: [{ name: 'Wireless Mouse', quantity: 1, price: 29.99 }],
  },
  {
    id: 'ORD-1044',
    customer: 'Isabella Nguyen',
    date: '2026-11-07',
    status: 'refunded',
    items: [
      { name: '27" Monitor', quantity: 1, price: 349 },
      { name: 'Monitor Arm', quantity: 1, price: 89.5 },
      { name: 'HDMI Cable', quantity: 2, price: 12 },
    ],
  },
  {
    id: 'ORD-1045',
    customer: 'William Kim',
    date: '2026-11-09',
    status: 'paid',
    items: [{ name: 'Laptop Stand', quantity: 1, price: 59 }],
  },
];

const features = tableFeatures({
  rowExpandingFeature,
  columnMeta: {} as ZardDataTableColumnMeta,
});

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

const totalOf = (order: Order) => order.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

/** The chevron that opens and closes the row's detail. */
@Component({
  selector: 'z-demo-order-expand-toggle',
  imports: [ZardButtonComponent, NgIcon],
  template: `
    <button
      type="button"
      z-button
      zType="ghost"
      zSize="icon"
      class="size-8"
      [attr.aria-expanded]="cell().row.getIsExpanded()"
      [attr.aria-label]="(cell().row.getIsExpanded() ? 'Collapse ' : 'Expand ') + cell().row.original.id"
      (click)="cell().row.toggleExpanded()"
    >
      <ng-icon
        name="lucideChevronRight"
        class="transition-transform rtl:rotate-180"
        [class.rotate-90]="cell().row.getIsExpanded()"
        aria-hidden="true"
      />
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideChevronRight })],
})
export class OrderExpandToggleComponent {
  protected readonly cell = injectTableCellContext<typeof features, Order, unknown>();
}

const columnHelper = createColumnHelper<typeof features, Order>();

const columns = columnHelper.columns([
  columnHelper.display({
    id: 'expand',
    cell: () => flexRenderComponent(OrderExpandToggleComponent),
    meta: { cellClass: 'w-10' },
  }),
  columnHelper.accessor('id', { header: 'Order', meta: { cellClass: 'font-medium' } }),
  columnHelper.accessor('customer', { header: 'Customer' }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ getValue }) => getValue().charAt(0).toUpperCase() + getValue().slice(1),
  }),
  columnHelper.accessor(totalOf, {
    id: 'total',
    header: 'Total',
    cell: ({ getValue }) => currency.format(getValue()),
    meta: { headerClass: 'text-end', cellClass: 'text-end font-medium' },
  }),
]);

@Component({
  selector: 'z-demo-data-table-expandable',
  imports: [ZardDataTableImports],
  template: `
    <z-data-table [zTable]="table" [zExpandedRow]="detail" />

    <ng-template #detail let-row>
      <div class="bg-muted/30 px-12 py-3 text-sm">
        <p class="text-muted-foreground mb-2">Ordered on {{ row.original.date }}</p>
        <ul class="flex flex-col gap-1">
          @for (item of row.original.items; track item.name) {
            <li class="flex justify-between gap-4">
              <span>{{ item.quantity }} × {{ item.name }}</span>
              <span class="tabular-nums">{{ format(item.quantity * item.price) }}</span>
            </li>
          }
        </ul>
      </div>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
})
export class ZardDemoDataTableExpandableComponent {
  readonly data = signal<Order[]>(ORDERS);

  readonly table = injectTable(() => ({
    features,
    columns,
    data: this.data(),
    getRowId: row => row.id,
    getRowCanExpand: () => true,
  }));

  protected format(value: number): string {
    return currency.format(value);
  }
}
