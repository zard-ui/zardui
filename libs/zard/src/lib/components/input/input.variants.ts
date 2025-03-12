import { cva, VariantProps } from 'class-variance-authority';

export type zInputIcon = 'email' | 'password' | 'text';

export const inputVariants = cva(
  'flex h-10 w-full rounded-md border bg-background px-3 py-2 file:border-0 file:bg-transparent file:text-sm file:text-foreground file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
  {
    variants: {
      zType: {
        default: 'border-input text-base focus-visible:ring-ring',
        primary: 'border-primary text-primary placeholder:text-primary focus-visible:ring-primary',
        secondary: 'border-secondary text-secondary-foreground placeholder:text-secondary-foreground focus-visible:ring-secondary',
        destructive: 'border-destructive text-destructive placeholder:text-destructive/50 focus-visible:ring-destructive',
      },
    },
    defaultVariants: {
      zType: 'default',
    },
  },
);

export type ZardInputVariants = VariantProps<typeof inputVariants>;
