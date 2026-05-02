import { cva, type VariantProps } from 'class-variance-authority';

export const inputVariants = cva(
  'flex w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 font-normal transition-colors file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      zSize: {
        default: 'h-9 py-1 text-base md:text-sm file:h-7 file:text-sm file:max-md:py-0',
        sm: 'h-8 py-1 text-base md:text-sm file:h-6 file:text-sm file:max-md:py-1.5',
        lg: 'h-10 py-1 text-base file:h-7 file:text-sm file:max-md:py-2.5',
      },
      zStatus: {
        error: 'border-destructive focus-visible:ring-destructive',
        warning: 'border-yellow-500 focus-visible:ring-yellow-500',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
      zBorderless: {
        true: 'flex-1 border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export type ZardInputSizeVariants = NonNullable<VariantProps<typeof inputVariants>['zSize']>;
export type ZardInputStatusVariants = NonNullable<VariantProps<typeof inputVariants>['zStatus']>;
