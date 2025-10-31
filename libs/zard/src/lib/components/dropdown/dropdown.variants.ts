import { cva, type VariantProps } from 'class-variance-authority';

export const dropdownContentVariants = cva('bg-popover text-popover-foreground z-50 min-w-[200px] overflow-y-auto rounded-md border py-1 px-1 shadow-md');

export const dropdownItemVariants = cva(
  'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: '',
        destructive: 'text-destructive hover:bg-destructive/10 focus:bg-destructive/10 dark:hover:bg-destructive/20 dark:focus:bg-destructive/20 focus:text-destructive',
      },
      inset: {
        true: 'pl-8',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      inset: false,
    },
  },
);

export const dropdownLabelVariants = cva('relative flex items-center px-2 py-1.5 text-sm font-medium text-muted-foreground', {
  variants: {
    inset: {
      true: 'pl-8',
      false: '',
    },
  },
  defaultVariants: {
    inset: false,
  },
});

export const dropdownShortcutVariants = cva('ml-auto text-xs tracking-widest text-muted-foreground');

export type ZardDropdownItemVariants = VariantProps<typeof dropdownItemVariants>;
export type ZardDropdownLabelVariants = VariantProps<typeof dropdownLabelVariants>;
