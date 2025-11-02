import { cva, type VariantProps } from 'class-variance-authority';

export const selectVariants = cva('relative inline-block w-full');

export const selectTriggerVariants = cva(
  'flex w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none cursor-pointer focus-visible:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-placeholder:text-muted-foreground [&_svg:not([class*="text-"])]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      zSize: {
        sm: 'h-8 text-xs',
        default: 'h-9 text-sm',
        lg: 'h-10 text-base',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);
export const selectContentVariants = cva(
  'z-9999 min-w-full overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 zoom-in-95',
);
export const selectItemVariants = cva(
  'relative flex min-w-full cursor-pointer text-nowrap items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:hover:bg-transparent data-disabled:hover:text-current [&_svg:not([class*="text-"])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
);

export type ZardSelectTriggerVariants = VariantProps<typeof selectTriggerVariants>;
export type ZardSelectContentVariants = VariantProps<typeof selectContentVariants>;
export type ZardSelectItemVariants = VariantProps<typeof selectItemVariants>;
