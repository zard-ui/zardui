import { cva, VariantProps } from 'class-variance-authority';

export const toggleGroupVariants = cva('inline-flex items-center justify-center gap-1', {
  variants: {
    zSize: {
      sm: 'gap-1',
      md: 'gap-1',
      lg: 'gap-1',
    },
  },
  defaultVariants: {
    zSize: 'md',
  },
});

export const toggleGroupItemVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      zSize: {
        sm: 'h-8 px-2',
        md: 'h-9 px-3',
        lg: 'h-10 px-3',
      },
    },
    defaultVariants: {
      zSize: 'md',
    },
  },
);

export type ZardToggleGroupVariants = VariantProps<typeof toggleGroupVariants>;
export type ZardToggleGroupItemVariants = VariantProps<typeof toggleGroupItemVariants>;
