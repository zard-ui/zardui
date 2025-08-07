import { cva, VariantProps } from 'class-variance-authority';

export const paginationBasicVariants = cva('mx-auto flex w-full justify-center');
export type ZardPaginationBasicVariants = VariantProps<typeof paginationBasicVariants>;

export const paginationContentVariants = cva('flex flex-row items-center gap-1');
export type ZardPaginationContentVariants = VariantProps<typeof paginationContentVariants>;

export const paginationItemVariants = cva('');
export type ZardPaginationItemVariants = VariantProps<typeof paginationItemVariants>;

export const paginationLinkVariants = cva(
  'inline-flex items-center justify-center gap-2 shrink-0 whitespace-nowrap rounded-md text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-50 [&>div[class^=icon-]]:pointer-events-none [&>div[class^=icon-]]:shrink-0 [&>div[class^=icon-]:not([class*="text-"])]:!text-base focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      zType: {
        outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
      },
      zSize: {
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>div[class^=icon-]]:px-2.5',
        md: 'h-9 px-4 py-2 has-[>div[class^=icon-]]:px-3',
        lg: 'h-10 rounded-md px-6 has-[>div[class^=icon-]]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      zType: 'ghost',
      zSize: 'md',
    },
  },
);
export type ZardPaginationLinkVariants = VariantProps<typeof paginationLinkVariants>;

export const paginationPreviousVariants = cva('gap-1 px-2.5 sm:pl-2.5');
export type ZardPaginationPreviousVariants = VariantProps<typeof paginationPreviousVariants>;

export const paginationNextVariants = cva('gap-1 px-2.5 sm:pr-2.5');
export type ZardPaginationNextVariants = VariantProps<typeof paginationNextVariants>;

export const paginationEllipsisVariants = cva('flex size-9 items-center justify-center');
export type ZardPaginationEllipsisVariants = VariantProps<typeof paginationEllipsisVariants>;

export const paginationVariants = cva('mx-auto flex w-full justify-center');
export type ZardPaginationVariants = VariantProps<typeof paginationVariants>;
