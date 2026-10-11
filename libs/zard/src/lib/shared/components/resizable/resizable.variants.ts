import { cva, type VariantProps } from 'class-variance-authority';

export const resizableVariants = cva('cn-resizable', {
  variants: {
    zLayout: {
      horizontal: '',
      vertical: '',
    },
  },
  defaultVariants: {
    zLayout: 'horizontal',
  },
});

export const resizablePanelVariants = cva('cn-resizable-panel', {
  variants: {
    zCollapsed: {
      true: 'cn-resizable-panel-collapsed-true',
      false: '',
    },
  },
  defaultVariants: {
    zCollapsed: false,
  },
});

export const resizableHandleVariants = cva('cn-resizable-handle', {
  variants: {
    zLayout: {
      horizontal: 'cn-resizable-handle-layout-horizontal',
      vertical: 'cn-resizable-handle-layout-vertical',
    },
    zDisabled: {
      true: 'cn-resizable-handle-disabled-true pointer-events-none',
      false: '',
    },
  },
  defaultVariants: {
    zDisabled: false,
  },
});

export const resizableHandleIndicatorVariants = cva('cn-resizable-handle-indicator');

export type ZardResizableLayoutVariants = NonNullable<VariantProps<typeof resizableVariants>['zLayout']>;
