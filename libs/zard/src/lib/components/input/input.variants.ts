import { cva, VariantProps } from 'class-variance-authority';

export type zInputIcon = 'email' | 'password' | 'text';

export const inputVariants = cva(
  'flex rounded-md border px-4 font-normal border-input bg-transparent text-base md:text-sm ring-offset-background file:border-0 file:text-foreground file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      zSize: {
        default: 'h-10 py-2 file:max-md:py-0',
        small: 'h-9 file:md:py-2 file:max-md:py-1.5',
        large: 'h-11 py-1 file:md:py-3 file:max-md:py-2.5',
      },
      zStatus: {
        error: 'border-destructive focus-visible:ring-destructive',
        warning: 'border-yellow-500 focus-visible:ring-yellow-500',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
      zBorderless: {
        true: 'border-0 focus-visible:ring-0',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export type ZardInputVariants = VariantProps<typeof inputVariants>;
