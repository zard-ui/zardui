### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">table.component.ts

```angular-ts showLineNumbers
import { ClassValue } from 'class-variance-authority/dist/types';

import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';

import { mergeClasses } from '../../shared/utils/utils';
import {
  tableVariants,
  tableHeaderVariants,
  tableBodyVariants,
  tableRowVariants,
  tableHeadVariants,
  tableCellVariants,
  tableCaptionVariants,
  ZardTableVariants,
} from './table.variants';

@Component({
  selector: 'table[z-table]',
  exportAs: 'zTable',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableComponent {
  readonly zType = input<ZardTableVariants['zType']>('default');
  readonly zSize = input<ZardTableVariants['zSize']>('default');
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
  exportAs: 'zTableHeader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableHeaderComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(tableHeaderVariants(), this.class()));
}

@Component({
  selector: 'tbody[z-table-body]',
  exportAs: 'zTableBody',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableBodyComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(tableBodyVariants(), this.class()));
}

@Component({
  selector: 'tr[z-table-row]',
  exportAs: 'zTableRow',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableRowComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(tableRowVariants(), this.class()));
}

@Component({
  selector: 'th[z-table-head]',
  exportAs: 'zTableHead',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableHeadComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(tableHeadVariants(), this.class()));
}

@Component({
  selector: 'td[z-table-cell]',
  exportAs: 'zTableCell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableCellComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(tableCellVariants(), this.class()));
}

@Component({
  selector: 'caption[z-table-caption]',
  exportAs: 'zTableCaption',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `<ng-content />`,
  host: {
    '[class]': 'classes()',
  },
})
export class ZardTableCaptionComponent {
  readonly class = input<ClassValue>('');

  protected readonly classes = computed(() => mergeClasses(tableCaptionVariants(), this.class()));
}
```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">table.variants.ts

```angular-ts showLineNumbers
import { cva, VariantProps } from 'class-variance-authority';

export const tableVariants = cva(
  'w-full caption-bottom text-sm [&_thead_tr]:border-b [&_tbody]:border-0 [&_tbody_tr:last-child]:border-0 [&_tbody_tr]:border-b [&_tbody_tr]:transition-colors [&_tbody_tr]:hover:bg-muted/50 [&_tbody_tr]:data-[state=selected]:bg-muted [&_th]:h-10 [&_th]:px-2 [&_th]:text-left [&_th]:align-middle [&_th]:font-medium [&_th]:text-muted-foreground [&_th:has([role=checkbox])]:pr-0 [&_th>[role=checkbox]]:translate-y-[2px] [&_td]:p-2 [&_td]:align-middle [&_td:has([role=checkbox])]:pr-0 [&_td>[role=checkbox]]:translate-y-[2px] [&_caption]:mt-4 [&_caption]:text-sm [&_caption]:text-muted-foreground',
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

export const tableHeaderVariants = cva(
  '[&_tr]:border-b',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const tableBodyVariants = cva(
  '[&_tr:last-child]:border-0',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const tableRowVariants = cva(
  'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const tableHeadVariants = cva(
  'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const tableCellVariants = cva(
  'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const tableCaptionVariants = cva(
  'mt-4 text-sm text-muted-foreground',
  {
    variants: {},
    defaultVariants: {},
  },
);

export type ZardTableVariants = VariantProps<typeof tableVariants>;
export type ZardTableHeaderVariants = VariantProps<typeof tableHeaderVariants>;
export type ZardTableBodyVariants = VariantProps<typeof tableBodyVariants>;
export type ZardTableRowVariants = VariantProps<typeof tableRowVariants>;
export type ZardTableHeadVariants = VariantProps<typeof tableHeadVariants>;
export type ZardTableCellVariants = VariantProps<typeof tableCellVariants>;
export type ZardTableCaptionVariants = VariantProps<typeof tableCaptionVariants>;
```

### <img src="/icons/typescript.svg" class="w-4 h-4 inline mr-2" alt="TypeScript">table.module.ts

```angular-ts showLineNumbers
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  ZardTableComponent,
  ZardTableHeaderComponent,
  ZardTableBodyComponent,
  ZardTableRowComponent,
  ZardTableHeadComponent,
  ZardTableCellComponent,
  ZardTableCaptionComponent,
} from './table.component';

const TABLE_COMPONENTS = [
  ZardTableComponent,
  ZardTableHeaderComponent,
  ZardTableBodyComponent,
  ZardTableRowComponent,
  ZardTableHeadComponent,
  ZardTableCellComponent,
  ZardTableCaptionComponent,
];

@NgModule({
  imports: [CommonModule, ...TABLE_COMPONENTS],
  exports: [...TABLE_COMPONENTS],
})
export class ZardTableModule {}
```