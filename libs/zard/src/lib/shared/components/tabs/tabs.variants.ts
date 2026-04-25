import { cva, type VariantProps } from 'class-variance-authority';

export const tabContainerVariants = cva('group/tabs flex gap-2', {
  variants: {
    zOrientation: {
      horizontal: 'flex-col',
      vertical: 'flex-row',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const tabNavVariants = cva(
  [
    'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground',
    'group-data-[orientation=horizontal]/tabs:h-8 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col',
    'data-[variant=line]:rounded-none',
  ].join(' '),
  {
    variants: {
      zVariant: {
        default: 'bg-muted',
        line: 'gap-1 bg-transparent',
      },
    },
    defaultVariants: {
      zVariant: 'default',
    },
  },
);

export const tabButtonVariants = cva(
  [
    'relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5',
    'rounded-md border border-transparent px-1.5 py-0.5 text-sm font-medium whitespace-nowrap',
    'text-foreground/60 transition-all cursor-pointer',
    'group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start',
    'hover:text-foreground',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring',
    'disabled:pointer-events-none disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    'dark:text-muted-foreground dark:hover:text-foreground',
    'group-data-[variant=default]/tabs-list:data-active:shadow-sm group-data-[variant=line]/tabs-list:data-active:shadow-none',
    'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent',
    'dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent',
    'data-active:bg-background data-active:text-foreground',
    'dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground',
    'after:absolute after:bg-foreground after:opacity-0 after:transition-opacity',
    'group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5',
    'group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5',
    'group-data-[variant=line]/tabs-list:data-active:after:opacity-100',
  ].join(' '),
);

export type ZardTabVariants = VariantProps<typeof tabContainerVariants> & VariantProps<typeof tabNavVariants>;
