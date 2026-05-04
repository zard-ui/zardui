import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const selectVariants = cva(
  mergeClasses(
    'relative inline-block w-full rounded-md group',
    '[&_button]:focus-visible:border [&_button]:focus-visible:border-ring [&_button]:focus-visible:ring-ring/50 [&_button]:focus-visible:ring-[3px]',
  ),
);

export const selectTriggerVariants = cva(
  mergeClasses(
    'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent',
    'text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none disabled:cursor-not-allowed',
    'disabled:opacity-50 data-[placeholder]:text-muted-foreground [&_svg:not([class*="text-"])]:text-muted-foreground',
    'dark:bg-input/30 dark:hover:bg-input/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    'aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
    '*:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2',
  ),
  {
    variants: {
      zSize: {
        sm: 'h-8 px-3 py-2 text-sm',
        default: 'h-9 px-3 py-2 text-sm',
        lg: 'h-10 px-4 py-2 text-base',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export const selectContentVariants = cva(
  mergeClasses(
    'relative z-50 flex max-h-96 w-full min-w-[8rem] origin-(--z-select-content-transform-origin) flex-col overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md',
    'data-[align-trigger=true]:animate-none',
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
  ),
  {
    variants: {
      zPosition: {
        'item-aligned': '',
        popper:
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
      },
    },
    defaultVariants: {
      zPosition: 'popper',
    },
  },
);

export const selectViewportVariants = cva('max-h-96 min-h-0 flex-1 box-border overflow-x-hidden overflow-y-auto p-1', {
  variants: {
    zPosition: {
      'item-aligned': '',
      popper: 'h-(--z-select-trigger-height) w-full min-w-(--z-select-trigger-width) scroll-my-1',
    },
  },
  defaultVariants: {
    zPosition: 'popper',
  },
});

export const selectScrollButtonVariants = cva(
  'z-10 flex cursor-default items-center justify-center bg-popover py-1 [&_svg:not([class*="size-"])]:size-4',
);

export const selectGroupVariants = cva('');

export const selectLabelVariants = cva('px-2 py-1.5 text-xs text-muted-foreground');

export const selectSeparatorVariants = cva('pointer-events-none -mx-1 block my-1 h-px bg-border');

export const selectItemVariants = cva(
  'relative flex w-full cursor-default items-center gap-2 rounded-sm outline-hidden select-none',
  {
    variants: {
      zSize: {
        sm: 'py-1 text-xs',
        default: 'py-1.5 text-sm',
        lg: 'py-2 text-base',
      },
      zMode: {
        normal: 'pr-8 pl-2',
        compact: 'pr-8 pl-2',
      },
    },
    defaultVariants: {
      zSize: 'default',
      zMode: 'normal',
    },
  },
);

export const selectItemStateVariants = cva(
  mergeClasses(
    'focus:bg-accent focus:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground',
    'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 [&_svg:not([class*="text-"])]:text-muted-foreground',
    '*:data-[slot=select-item-text]:flex *:data-[slot=select-item-text]:items-center *:data-[slot=select-item-text]:gap-2',
  ),
);

export const selectItemIconVariants = cva('absolute flex size-3.5 items-center justify-center text-current', {
  variants: {
    // zSize variants are placeholders for compound variant matching
    zSize: {
      sm: '',
      default: '',
      lg: '',
    },
    zMode: {
      normal: 'right-2',
      compact: 'right-2',
    },
  },
  defaultVariants: {
    zSize: 'default',
    zMode: 'normal',
  },
});

export type ZardSelectSizeVariants = NonNullable<VariantProps<typeof selectTriggerVariants>['zSize']>;
export type ZardSelectPositionVariants = NonNullable<VariantProps<typeof selectContentVariants>['zPosition']>;
export type ZardSelectItemModeVariants = NonNullable<VariantProps<typeof selectItemVariants>['zMode']>;
export type ZardSelectAlignVariants = 'start' | 'center' | 'end';
