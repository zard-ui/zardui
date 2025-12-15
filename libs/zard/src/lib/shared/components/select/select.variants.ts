import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const selectVariants = cva(
  mergeClasses(
    'relative inline-block w-full rounded-md group data-active:border data-active:border-ring data-active:ring-ring/50 data-active:ring-[3px]',
    '[&_button]:focus-visible:border [&_button]:focus-visible:border-ring [&_button]:focus-visible:ring-ring/50 [&_button]:focus-visible:ring-[3px]',
  ),
);

export const selectTriggerVariants = cva(
  mergeClasses(
    'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent',
    'shadow-xs transition-[color,box-shadow] outline-none cursor-pointer disabled:cursor-not-allowed',
    'disabled:opacity-50 data-placeholder:text-muted-foreground [&_svg:not([class*="text-"])]:text-muted-foreground',
    'dark:bg-input/30 dark:hover:bg-input/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    'aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  ),
  {
    variants: {
      zSize: {
        sm: 'min-h-8 py-1 text-xs px-2',
        default: 'min-h-9 py-1.5 px-3 text-sm',
        lg: 'min-h-10 py-2 text-base px-4',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);
export const selectContentVariants = cva(
  'z-9999 min-w-full scrollbar-hide overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95',
);
export const selectItemVariants = cva(
  'relative flex min-w-full cursor-pointer text-nowrap items-center gap-2 rounded-sm mb-0.5 outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-selected:bg-accent data-selected:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:hover:bg-transparent data-disabled:hover:text-current [&_svg:not([class*="text-"])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      zSize: {
        sm: 'min-h-8 py-1 text-xs',
        default: 'min-h-9 py-1.5 text-sm',
        lg: 'min-h-10 py-2 text-base',
      },
      zMode: {
        normal: 'pr-8 pl-2',
        compact: 'pl-6.5 pr-2',
      },
    },
    compoundVariants: [
      {
        zMode: 'compact',
        zSize: 'sm',
        class: 'pl-5 pr-2',
      },
    ],
  },
);

export const selectItemIconVariants = cva('absolute flex size-3.5 items-center justify-center', {
  variants: {
    // zSize variants are placeholders for compound variant matching
    zSize: {
      sm: '',
      default: '',
      lg: '',
    },
    zMode: {
      normal: 'right-2',
      compact: 'left-2',
    },
  },
  compoundVariants: [
    {
      zMode: 'compact',
      zSize: 'sm',
      class: 'left-1',
    },
  ],
});

export type ZardSelectSizeVariants = NonNullable<VariantProps<typeof selectTriggerVariants>['zSize']>;
export type ZardSelectItemModeVariants = NonNullable<VariantProps<typeof selectItemVariants>['zMode']>;
