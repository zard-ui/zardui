import { cva, type VariantProps } from 'class-variance-authority';

export type zInputIcon = 'email' | 'password' | 'text';

export const inputVariants = cva('w-full min-w-0', {
  variants: {
    zType: {
      default:
        'flex rounded-lg border border-input bg-transparent px-2.5 font-normal transition-colors file:inline-flex file:border-0 file:bg-transparent file:font-medium file:text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 dark:disabled:bg-input/80',
      textarea:
        'flex pb-2 min-h-20 h-auto rounded-lg border border-input bg-transparent px-3 py-2 text-base transition-colors placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 dark:bg-input/30 dark:disabled:bg-input/80',
    },
    zSize: {
      default: 'text-base md:text-sm',
      sm: 'text-base md:text-sm',
      lg: 'text-base',
    },
    zStatus: {
      error: 'border-destructive focus-visible:ring-destructive',
      warning: 'border-yellow-500 focus-visible:ring-yellow-500',
      success: 'border-green-500 focus-visible:ring-green-500',
    },
    zBorderless: {
      true: 'flex-1 bg-transparent border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0',
    },
  },
  defaultVariants: {
    zType: 'default',
    zSize: 'default',
  },
  compoundVariants: [
    { zType: 'default', zSize: 'default', class: 'h-9 py-1 file:h-7 file:text-sm file:max-md:py-0' },
    { zType: 'default', zSize: 'sm', class: 'h-8 py-1 file:h-6 file:text-sm file:max-md:py-1.5' },
    { zType: 'default', zSize: 'lg', class: 'h-10 py-1 file:h-7 file:text-sm file:max-md:py-2.5' },
  ],
});

export type ZardInputTypeVariants = NonNullable<VariantProps<typeof inputVariants>['zType']>;
export type ZardInputSizeVariants = NonNullable<VariantProps<typeof inputVariants>['zSize']>;
export type ZardInputStatusVariants = NonNullable<VariantProps<typeof inputVariants>['zStatus']>;
