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
  'h-10 px-2 text-left align-middle font-medium text-muted-foreground has-[[role=checkbox]]:pr-0 *:[[role=checkbox]]:translate-y-0.5',
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
export * from '@/shared/components/table/table.component';
export * from '@/shared/components/table/table.imports';
export * from '@/shared/components/table/table.variants';
```

```angular-ts
import {
  ZardTableComponent,
  ZardTableHeaderComponent,
  ZardTableBodyComponent,
  ZardTableRowComponent,
  ZardTableHeadComponent,
  ZardTableCellComponent,
  ZardTableCaptionComponent,
  ZardTableFooterComponent,
} from '@/shared/components/table/table.component';

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

```angular-ts
import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideEye } from '@ng-icons/lucide';

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
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head>Invoice</th>
          <th z-table-head>Status</th>
          <th z-table-head>Method</th>
          <th z-table-head class="text-end">Amount</th>
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
  viewProviders: [provideIcons({ lucideCopy, lucideEye })],
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

```angular-ts
import { Component } from '@angular/core';

import { ZardTableImports } from '../table.imports';

interface Product {
  id: number;
  name: string;
  price: number;
}

@Component({
  selector: 'z-demo-table-actions',
  imports: [ZardTableImports],
  template: `
    <table z-table>
      <thead z-table-header>
        <tr z-table-row>
          <th z-table-head>Product</th>
          <th z-table-head>Price</th>
          <th z-table-head>Actions</th>
        </tr>
      </thead>
      <tbody z-table-body>
        @for (product of products; track product.id) {
          <tr z-table-row>
            <td z-table-cell class="font-medium">{{ product.name }}</td>
            <td z-table-cell>{{ product.price }}</td>
            <td z-table-cell></td>
          </tr>
        }
      </tbody>
    </table>
  `,
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

## API Reference

### [z-table]

A directive that accepts all properties supported by a native table. It automatically styles all nested table elements without requiring additional directives.

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| `zType` | Table type | `'default' \| 'striped' \| 'bordered'` | `'default'` |
| `zSize` | Table size | `'default' \| 'compact' \| 'comfortable'` | `'default'` |

### [z-table-header]

Applies styles to table header sections.

### [z-table-body]

Applies styles to table body sections.

### [z-table-row]

Applies styles to table rows.

### [z-table-head]

Applies styles to table header cells.

### [z-table-cell]

Applies styles to table data cells.

### [z-table-caption]

Applies styles to table captions.

### [z-table-footer]

Applies styles to table footer.

---

[Open in browser](https://zardui.com/docs/components/table)
