import { cva, type VariantProps } from 'class-variance-authority';

export const resizableVariants = cva('flex h-full w-full data-[layout=vertical]:flex-col overflow-hidden', {
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

export const resizablePanelVariants = cva('relative overflow-hidden shrink-0 h-full', {
  variants: {
    zCollapsed: {
      true: 'hidden',
      false: '',
    },
  },
  defaultVariants: {
    zCollapsed: false,
  },
});

export const resizableHandleVariants = cva(
  'group relative flex shrink-0 items-center justify-center bg-border transition-colors hover:bg-border/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1',
  {
    variants: {
      zLayout: {
        horizontal:
          'w-px min-w-px cursor-col-resize after:absolute after:inset-y-0 after:left-1/2 after:w-4 after:-translate-x-1/2',
        vertical:
          'h-px min-h-px w-full cursor-row-resize after:absolute after:inset-x-0 after:top-1/2 after:h-4 after:-translate-y-1/2',
      },
      zDisabled: {
        true: 'cursor-default pointer-events-none opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      zLayout: 'horizontal',
      zDisabled: false,
    },
  },
);

export const resizableHandleIndicatorVariants = cva(
  'absolute z-10 bg-muted-foreground/30 transition-colors group-hover:bg-muted-foreground/50 rounded-full',
  {
    variants: {
      zLayout: {
        vertical: 'w-8 h-px',
        horizontal: 'w-px h-8',
      },
    },
    defaultVariants: {
      zLayout: 'horizontal',
    },
  },
);

export type ZardResizableLayoutVariants = NonNullable<VariantProps<typeof resizableVariants>['zLayout']>;
