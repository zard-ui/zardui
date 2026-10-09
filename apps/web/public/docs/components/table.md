---
title: Table
description: A responsive table component for displaying structured data.
---

# Table

A responsive table component for displaying structured data.

## Installation

### CLI

```bash
npx zard-cli@latest add table
```

### Manual

```angular-ts
import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import type { ClassValue } from 'clsx';

import {
  type ZardTableSizeVariants,
  type ZardTableTypeVariants,
  tableBodyVariants,
  tableCaptionVariants,
  tableCellVariants,
  tableFooterVariants,
  tableHeaderVariants,
  tableHeadVariants,
  tableRowVariants,
  tableVariants,
} from '@/shared/components/table/table.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

@Component({
  selector: 'table[z-table]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'table',
    '[class]': 'classes()',
  },
  exportAs: 'zTable',
})
export class ZardTableComponent {
  readonly zType = input<ZardTableTypeVariants>('default');
  readonly zSize = input<ZardTableSizeVariants>('default');
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() =>
    mergeClasses(
      tableVariants({
        zType: this.zType(),
        zSize: this.zSize(),
      }),
      this.class(),
    ),
  );
}

@Component({
  selector: 'thead[z-table-header]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'table-header',
    '[class]': 'classes()',
  },
  exportAs: 'zTableHeader',
})
export class ZardTableHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(tableHeaderVariants(), this.class()));
}

@Component({
  selector: 'tbody[z-table-body]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'table-body',
    '[class]': 'classes()',
  },
  exportAs: 'zTableBody',
})
export class ZardTableBodyComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(tableBodyVariants(), this.class()));
}

@Component({
  selector: 'tr[z-table-row]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'table-row',
    '[class]': 'classes()',
  },
  exportAs: 'zTableRow',
})
export class ZardTableRowComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(tableRowVariants(), this.class()));
}

@Component({
  selector: 'th[z-table-head]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'table-head',
    '[class]': 'classes()',
  },
  exportAs: 'zTableHead',
})
export class ZardTableHeadComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(tableHeadVariants(), this.class()));
}

@Component({
  selector: 'td[z-table-cell]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'table-cell',
    '[class]': 'classes()',
  },
  exportAs: 'zTableCell',
})
export class ZardTableCellComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(tableCellVariants(), this.class()));
}

@Component({
  selector: 'caption[z-table-caption]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'table-caption',
    '[class]': 'classes()',
  },
  exportAs: 'zTableCaption',
})
export class ZardTableCaptionComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(tableCaptionVariants(), this.class()));
}

@Component({
  selector: 'tfoot[z-table-footer]',
  template: `
    <ng-content />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'data-slot': 'table-footer',
    '[class]': 'classes()',
  },
  exportAs: 'zTableFooter',
})
export class ZardTableFooterComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(tableFooterVariants(), this.class()));
}
```

```angular-ts
import { cva, type VariantProps } from 'class-variance-authority';

export const tableVariants = cva(
  'w-full caption-bottom text-sm [&_thead_tr]:border-b [&_tbody]:border-0 [&_tbody_tr:last-child]:border-0 [&_tbody_tr]:border-b [&_tbody_tr]:transition-colors [&_tbody_tr]:hover:bg-muted/50 [&_tbody_tr]:data-[state=selected]:bg-muted [&_th]:h-10 [&_th]:px-2 [&_th]:align-middle [&_th]:font-medium [&_th]:text-muted-foreground [&_th:has([role=checkbox])]:pr-0 [&_th>[role=checkbox]]:translate-y-0.5 [&_td]:p-2 [&_td]:align-middle [&_td:has([role=checkbox])]:pr-0 [&_td>[role=checkbox]]:translate-y-0.5 [&_caption]:mt-4 [&_caption]:text-sm [&_caption]:text-muted-foreground',
  {
    variants: {
      zType: {
        default: '',
        striped: '[&_tbody_tr:nth-child(odd)]:bg-muted/50',
        bordered: 'border border-border',
      },
      zSize: {
        default: '',
        compact: '[&_td]:py-2 [&_th]:py-2',
        comfortable: '[&_td]:py-4 [&_th]:py-4',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
    },
  },
);

export const tableHeaderVariants = cva('[&_tr]:border-b', {
  variants: {},
  defaultVariants: {},
});

export const tableBodyVariants = cva('[&_tr:last-child]:border-0', {
  variants: {},
  defaultVariants: {},
});

export const tableRowVariants = cva(
  'border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const tableHeadVariants = cva(
  'h-10 px-2 text-start align-middle font-medium text-muted-foreground has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const tableCellVariants = cva(
  'p-2 align-middle has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const tableCaptionVariants = cva('mt-4 text-sm text-muted-foreground', {
  variants: {},
  defaultVariants: {},
});

export const tableFooterVariants = cva('border-t bg-muted/50 font-medium [&>tr]:last:border-b-0');

export type ZardTableSizeVariants = NonNullable<VariantProps<typeof tableVariants>['zSize']>;
export type ZardTableTypeVariants = NonNullable<VariantProps<typeof tableVariants>['zType']>;
```

```angular-ts
export * from './table.component';
export * from './table.imports';
export * from './table.variants';
```

```angular-ts
export {
  ZardTableComponent,
  ZardTableHeaderComponent,
  ZardTableBodyComponent,
  ZardTableRowComponent,
  ZardTableHeadComponent,
  ZardTableCellComponent,
  ZardTableCaptionComponent,
  ZardTableFooterComponent,
} from './table.component';

import {
  ZardTableComponent,
  ZardTableHeaderComponent,
  ZardTableBodyComponent,
  ZardTableRowComponent,
  ZardTableHeadComponent,
  ZardTableCellComponent,
  ZardTableCaptionComponent,
  ZardTableFooterComponent,
} from './table.component';

export const ZardTableImports = [
  ZardTableComponent,
  ZardTableHeaderComponent,
  ZardTableBodyComponent,
  ZardTableRowComponent,
  ZardTableHeadComponent,
  ZardTableCellComponent,
  ZardTableCaptionComponent,
  ZardTableFooterComponent,
] as const;
```

## Usage

```angular-ts
import { ZardTableImports } from '@/shared/components/table/table.imports';
```

```angular-html
<table z-table>
  <thead z-table-header>
    <tr z-table-row>
      <th z-table-head>Name</th>
      <th z-table-head>Status</th>
    </tr>
  </thead>
  <tbody z-table-body>
    <tr z-table-row>
      <td z-table-cell>Item 1</td>
      <td z-table-cell>Active</td>
    </tr>
  </tbody>
</table>
```

## Composition

```text
z-table
├── caption[z-table-caption]
├── thead[z-table-header]
│   └── tr[z-table-row]
│       ├── th[z-table-head]
│       ├── th[z-table-head]
│       └── th[z-table-head]
├── tbody[z-table-body]
│   ├── tr[z-table-row]
│   │   ├── td[z-table-cell]
│   │   ├── td[z-table-cell]
│   │   └── td[z-table-cell]
│   └── tr[z-table-row]
│       ├── td[z-table-cell]
│       ├── td[z-table-cell]
│       └── td[z-table-cell]
└── tfoot[z-table-footer]
    └── tr[z-table-row]
        ├── td[z-table-cell]
        └── td[z-table-cell]
```

## Examples

### Footer

Add a `tfoot[z-table-footer]` to render a summary row below the table body.

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { ZardTableImports } from '@/shared/components/table/table.imports';

export interface Invoice {
  id: string;
  status: string;
  method: string;
  amount: number;
}

@Component({
  selector: 'z-demo-table-footer',
  imports: [ZardTableImports],
  template: `
    <table z-table>
      <caption z-table-caption>A list of your recent invoices.</caption>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head scope="col">Invoice</th>
          <th z-table-head scope="col">Status</th>
          <th z-table-head scope="col">Method</th>
          <th z-table-head scope="col" class="text-end">Amount</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (invoice of invoices(); track invoice.id) {
          <tr z-table-row>
            <td z-table-cell>{{ invoice.id }}</td>
            <td z-table-cell>
              <div>{{ invoice.status }}</div>
            </td>

            <td z-table-cell>
              {{ invoice.method }}
            </td>
            <td z-table-cell>
              <div class="text-right font-medium">{{ formatCurrency(invoice.amount) }}</div>
            </td>
          </tr>
        } @empty {
          <tr z-table-row>
            <td z-table-cell [attr.colspan]="4" class="h-24 text-center">No results.</td>
          </tr>
        }
      </tbody>
      <tfoot z-table-footer>
        <tr z-table-row>
          <td z-table-cell colspan="3">Total</td>
          <td z-table-cell class="text-right">{{ formatCurrency(total()) }}</td>
        </tr>
      </tfoot>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full overflow-x-auto',
  },
})
export class ZardDemoTableFooterComponent {
  readonly invoices = signal<Invoice[]>([
    {
      id: 'INV001',
      status: 'Paid',
      method: 'Credit Card',
      amount: 250,
    },
    {
      id: 'INV002',
      status: 'Pending',
      method: 'PayPal',
      amount: 150,
    },
    {
      id: 'INV003',
      status: 'Unpaid',
      method: 'Bank Transfer',
      amount: 350,
    },
  ]);

  readonly total = computed(() =>
    this.invoices().reduce((sum: number, invoice: { amount: number }) => sum + invoice.amount, 0),
  );

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}
```

### Actions

A table showing actions for each row using a `z-dropdown` menu.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis } from '@ng-icons/lucide';

import { ZardDropdownImports } from '@/shared/components/dropdown';
import { ZardTableImports } from '@/shared/components/table/table.imports';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'z-demo-table-actions',
  imports: [ZardTableImports, ZardDropdownImports, NgIcon],
  template: `
    <table z-table aria-label="Products and their actions">
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head scope="col">Product</th>
          <th z-table-head scope="col">Price</th>
          <th z-table-head scope="col" class="text-right">Actions</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (product of products; track product.id) {
          <tr z-table-row>
            <td z-table-cell class="font-medium">{{ product.name }}</td>
            <td z-table-cell>{{ product.price }}</td>
            <td z-table-cell class="text-right">
              <button
                z-button
                z-dropdown
                zType="ghost"
                zSize="icon"
                zAlign="end"
                type="button"
                aria-label="Open actions"
                [zDropdownMenu]="menu"
              >
                <ng-icon name="lucideEllipsis" aria-hidden="true" />
              </button>
              <z-dropdown-menu-content #menu="zDropdownMenuContent" class="w-30 -translate-x-[calc(100%-1.5rem)]">
                <z-dropdown-menu-item>Edit</z-dropdown-menu-item>
                <z-dropdown-menu-item>Duplicate</z-dropdown-menu-item>
                <z-dropdown-menu-separator class="block" />
                <z-dropdown-menu-item
                  variant="destructive"
                  class="hover:text-destructive focus:text-destructive focus-visible:text-destructive data-highlighted:text-destructive"
                >
                  Delete
                </z-dropdown-menu-item>
              </z-dropdown-menu-content>
            </td>
          </tr>
        }
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideEllipsis })],
  host: {
    class: 'block w-full overflow-x-auto',
  },
})
export class ZardDemoTableActionsComponent {
  products: Product[] = [
    {
      id: 1,
      name: 'Wireless Mouse',
      price: 29.99,
    },
    {
      id: 2,
      name: 'Mechanical Keyboard',
      price: 129.99,
    },
    {
      id: 3,
      name: 'USB-C Hub',
      price: 49.99,
    },
  ];
}
```

### Simple

A minimal table with only a header and body — no footer or row actions.

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ZardTableImports } from '@/shared/components/table/table.imports';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'z-demo-table-simple',
  imports: [ZardTableImports],
  template: `
    <table z-table>
      <caption z-table-caption>A list of registered users.</caption>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head scope="col">Name</th>
          <th z-table-head scope="col">Age</th>
          <th z-table-head scope="col">Address</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (data of listOfData; track data.key) {
          <tr z-table-row>
            <td z-table-cell class="font-medium">{{ data.name }}</td>
            <td z-table-cell>{{ data.age }}</td>
            <td z-table-cell>{{ data.address }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full overflow-x-auto',
  },
})
export class ZardDemoTableSimpleComponent {
  listOfData: Person[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];
}
```

## API Reference

### table[z-table]

The table root. Apply the `z-table` attribute to a native `<table>` — it styles nested cells and rows through descendant selectors, and picks up the full set of per-slot styles once you also apply the matching attribute to each native tag: `z-table-header`, `z-table-body`, `z-table-row`, `z-table-head`, `z-table-cell`, `z-table-caption`, `z-table-footer`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |
| `[zType]` | Visual style of the table | `'default' \| 'striped' \| 'bordered'` | `'default'` |
| `[zSize]` | Row and cell padding density | `'default' \| 'compact' \| 'comfortable'` | `'default'` |

### thead[z-table-header]

The table header section. Apply the attribute to a native `<thead>`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### tbody[z-table-body]

The table body section. Apply the attribute to a native `<tbody>`; its last row renders without a bottom border.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### tr[z-table-row]

A table row. Apply the attribute to a native `<tr>`; it highlights on hover and when `[data-state="selected"]` is set on the element.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### th[z-table-head]

A header cell. Apply the attribute to a native `<th>`; set `scope="col"` (or `"row"`) on the element yourself so the table stays accessible.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### td[z-table-cell]

A data cell. Apply the attribute to a native `<td>`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### caption[z-table-caption]

The table caption, giving the table an accessible name for screen readers. Apply the attribute to a native `<caption>`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

### tfoot[z-table-footer]

The table footer section, typically a totals row. Apply the attribute to a native `<tfoot>`.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `[class]` | Custom CSS classes | `ClassValue` | `''` |

---

[Open in browser](https://zardui.com/docs/components/table)
