import { cva, VariantProps } from 'class-variance-authority';

export const segmentedVariants = cva('inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', {
  variants: {
    zSize: {
      sm: 'h-9 text-xs',
      default: 'h-10 text-sm',
      lg: 'h-12 text-base',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const segmentedItemVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      zSize: {
        sm: 'px-2 py-1 text-xs',
        default: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
      isActive: {
        true: 'bg-background text-foreground shadow-sm',
        false: 'hover:bg-muted/50',
      },
    },
    defaultVariants: {
      zSize: 'default',
      isActive: false,
    },
  },
);

export type ZardSegmentedVariants = VariantProps<typeof segmentedVariants>;
export type ZardSegmentedItemVariants = VariantProps<typeof segmentedItemVariants>;
