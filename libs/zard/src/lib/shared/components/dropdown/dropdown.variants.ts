import { cva, type VariantProps } from 'class-variance-authority';

export const dropdownContentVariants = cva([
  'z-50 min-w-32 max-h-96 overflow-x-hidden overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground',
  'shadow-md outline-none animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
]);

export const dropdownItemVariants = cva(
  'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:bg-accent focus-visible:text-accent-foreground data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 data-disabled:cursor-not-allowed [&_svg:not([class*=size-])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: '',
        destructive:
          'text-destructive hover:bg-destructive/10 focus:bg-destructive/10 dark:hover:bg-destructive/20 dark:focus:bg-destructive/20 focus:text-destructive',
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

export type ZardDropdownItemVariants = VariantProps<typeof dropdownItemVariants>;
export type ZardDropdownItemTypeVariants = NonNullable<ZardDropdownItemVariants['variant']>;
