import { cva, type VariantProps } from 'class-variance-authority';

export const textareaVariants = cva(
  'flex w-full min-w-0 min-h-20 rounded-lg border border-input bg-transparent px-3 py-2 pb-2 text-base transition-colors placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40',
  {
    variants: {
      zStatus: {
        error: 'border-destructive focus-visible:ring-destructive',
        warning: 'border-yellow-500 focus-visible:ring-yellow-500',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
      zBorderless: {
        true: 'flex-1 border-0 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0',
      },
    },
  },
);

export type ZardTextareaStatusVariants = NonNullable<VariantProps<typeof textareaVariants>['zStatus']>;
