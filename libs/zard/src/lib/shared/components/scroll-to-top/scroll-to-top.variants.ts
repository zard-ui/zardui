import { cva, type VariantProps } from 'class-variance-authority';

export const scrollToTopVariants = cva(
  [
    'fixed bottom-6 right-6 z-50',
    'inline-flex items-center justify-center rounded-full',
    'cursor-pointer',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'transition-opacity transition-colors',
  ],
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        subtle: 'bg-muted text-muted-foreground hover:bg-muted/80',
      },
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export const scrollToTopIconVariants = cva('', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type ScrollToTopVariants = VariantProps<typeof scrollToTopVariants>;
