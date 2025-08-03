import { cva, VariantProps } from 'class-variance-authority';

export const toggleGroupVariants = cva('flex w-fit items-center rounded-md', {
  variants: {
    zType: {
      default: '',
      outline: 'shadow-sm',
    },
    zSize: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    zType: 'default',
    zSize: 'md',
  },
});

export const toggleGroupItemVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-none gap-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground',
  {
    variants: {
      zType: {
        default: 'bg-transparent',
        outline: 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground',
      },
      zSize: {
        sm: 'h-8 px-2.5 text-xs',
        md: 'h-9 px-3 text-sm',
        lg: 'h-10 px-4 text-sm',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'md',
    },
  },
);

export type ZardToggleGroupVariants = VariantProps<typeof toggleGroupVariants>;
export type ZardToggleGroupItemVariants = VariantProps<typeof toggleGroupItemVariants>;
