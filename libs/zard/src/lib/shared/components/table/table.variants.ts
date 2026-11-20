import { cva, type VariantProps } from 'class-variance-authority';

export const tableVariants = cva('cn-table', {
  variants: {
    zType: {
      default: '',
      striped: 'cn-table-variant-striped',
      bordered: 'cn-table-variant-bordered',
    },
    zSize: {
      default: '',
      compact: 'cn-table-size-compact',
      comfortable: 'cn-table-size-comfortable',
    },
  },
  defaultVariants: {
    zType: 'default',
    zSize: 'default',
  },
});

export const tableHeaderVariants = cva('cn-table-header', {
  variants: {},
  defaultVariants: {},
});

export const tableBodyVariants = cva('cn-table-body', {
  variants: {},
  defaultVariants: {},
});

export const tableRowVariants = cva('cn-table-row', {
  variants: {},
  defaultVariants: {},
});

export const tableHeadVariants = cva('cn-table-head', {
  variants: {},
  defaultVariants: {},
});

export const tableCellVariants = cva('cn-table-cell', {
  variants: {},
  defaultVariants: {},
});

export const tableCaptionVariants = cva('cn-table-caption', {
  variants: {},
  defaultVariants: {},
});

export const tableFooterVariants = cva('cn-table-footer');

export type ZardTableSizeVariants = NonNullable<VariantProps<typeof tableVariants>['zSize']>;
export type ZardTableTypeVariants = NonNullable<VariantProps<typeof tableVariants>['zType']>;
