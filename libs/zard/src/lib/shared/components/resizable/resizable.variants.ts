import { cva, type VariantProps } from 'class-variance-authority';

export const resizableVariants = cva('flex size-full aria-[orientation=vertical]:flex-col', {
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
  'relative flex min-w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:min-h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90',
  {
    variants: {
      zLayout: {
        horizontal: 'cursor-ns-resize',
        vertical: 'cursor-ew-resize',
      },
      zDisabled: {
        true: 'cursor-default pointer-events-none opacity-50',
        false: '',
      },
    },
    defaultVariants: {
      zDisabled: false,
    },
  },
);

export const resizableHandleIndicatorVariants = cva('z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border');

export type ZardResizableLayoutVariants = NonNullable<VariantProps<typeof resizableVariants>['zLayout']>;
