---
title: Table
description: Displays data in a structured table format with styling variants and semantic HTML structure.
---

# Table

Displays data in a structured table format with styling variants and semantic HTML structure.

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
  'w-full caption-bottom text-sm [&_thead_tr]:border-b [&_tbody]:border-0 [&_tbody_tr:last-child]:border-0 [&_tbody_tr]:border-b [&_tbody_tr]:transition-colors [&_tbody_tr]:hover:bg-muted/50 [&_tbody_tr]:data-[state=selected]:bg-muted [&_th]:h-10 [&_th]:px-2 [&_th]:text-left [&_th]:align-middle [&_th]:font-medium [&_th]:text-muted-foreground [&_th:has([role=checkbox])]:pr-0 [&_th>[role=checkbox]]:translate-y-0.5 [&_td]:p-2 [&_td]:align-middle [&_td:has([role=checkbox])]:pr-0 [&_td>[role=checkbox]]:translate-y-0.5 [&_caption]:mt-4 [&_caption]:text-sm [&_caption]:text-muted-foreground',
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

export const tableFooterVariants = cva(
  'border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted',
);

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
} from '@/shared/components/table/table.component';

export const ZardTableImports = [
  ZardTableComponent,
  ZardTableHeaderComponent,
  ZardTableBodyComponent,
  ZardTableRowComponent,
  ZardTableHeadComponent,
  ZardTableCellComponent,
  ZardTableCaptionComponent,
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

## Examples

### Simple

```angular-ts
import { Component } from '@angular/core';

import { ZardTableComponent } from '../table.component';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'z-demo-table-simple',
  imports: [ZardTableComponent],
  standalone: true,
  template: `
    <table z-table>
      <caption>A list of your recent invoices.</caption>
      <thead>
        <tr>
          <th>Name</th>
          <th>Age</th>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        @for (data of listOfData; track data.key) {
          <tr>
            <td class="font-medium">{{ data.name }}</td>
            <td>{{ data.age }}</td>
            <td>{{ data.address }}</td>
          </tr>
        }
      </tbody>
    </table>
  `,
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

### Payments

```angular-ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideEye } from '@ng-icons/lucide';

import { ZardBadgeComponent } from '@/shared/components/badge/badge.component';
import { ZardButtonComponent } from '@/shared/components/button/button.component';
import { ZardTableImports } from '@/shared/components/table/table.imports';

export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
}

@Component({
  selector: 'z-demo-table-payments',
  imports: [ZardTableImports, ZardBadgeComponent, ZardButtonComponent, NgIcon],
  template: `
    <div class="w-full">
      <div class="overflow-hidden rounded-md border">
        <table z-table>
          <thead z-table-header>
            <tr z-table-row>
              <th z-table-head>Status</th>
              <th z-table-head>Email</th>
              <th z-table-head class="text-right">Amount</th>
              <th z-table-head class="w-16">Actions</th>
            </tr>
          </thead>
          <tbody z-table-body>
            @for (payment of payments; track payment.id) {
              <tr z-table-row>
                <td z-table-cell>
                  <z-badge [zType]="getStatusVariant(payment.status)">
                    {{ payment.status }}
                  </z-badge>
                </td>
                <td z-table-cell>
                  <div class="lowercase">{{ payment.email }}</div>
                </td>
                <td z-table-cell>
                  <div class="text-right font-medium">{{ formatCurrency(payment.amount) }}</div>
                </td>
                <td z-table-cell>
                  <div class="flex items-center gap-2">
                    <z-button zType="ghost" (click)="copyPaymentId(payment.id)" title="Copy payment ID">
                      <ng-icon name="lucideCopy" />
                    </z-button>
                    <z-button zType="ghost" (click)="viewDetails(payment)" title="View details">
                      <ng-icon name="lucideEye" />
                    </z-button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr z-table-row>
                <td z-table-cell [attr.colspan]="4" class="h-24 text-center">No results.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [provideIcons({ lucideCopy, lucideEye })],
})
export class ZardDemoTablePaymentsComponent {
  payments: Payment[] = [
    {
      id: 'm5gr84i9',
      amount: 316,
      status: 'success',
      email: 'ken99@example.com',
    },
    {
      id: '3u1reuv4',
      amount: 242,
      status: 'success',
      email: 'Abe45@example.com',
    },
    {
      id: 'derv1ws0',
      amount: 837,
      status: 'processing',
      email: 'Monserrat44@example.com',
    },
    {
      id: '5kma53ae',
      amount: 874,
      status: 'success',
      email: 'Silas22@example.com',
    },
    {
      id: 'bhqecj4p',
      amount: 721,
      status: 'failed',
      email: 'carmella@example.com',
    },
    {
      id: 'abc123ef',
      amount: 456,
      status: 'pending',
      email: 'jane.doe@example.com',
    },
  ];

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }

  getStatusVariant(status: Payment['status']): 'default' | 'secondary' | 'destructive' | 'outline' {
    switch (status) {
      case 'success':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  }

  copyPaymentId(id: string): void {
    navigator.clipboard.writeText(id);
    console.log('Payment ID copied:', id);
  }

  viewDetails(payment: Payment): void {
    console.log('View payment details:', payment);
  }
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

---

[Open in browser](https://zardui.com/docs/components/table)
