import { cva, type VariantProps } from 'class-variance-authority';

export const switchVariants = cva(
  'peer relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      zSize: {
        default: 'h-[18.4px] w-[32px]',
        sm: 'h-[14px] w-[24px]',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export type ZardSwitchSizeVariants = NonNullable<VariantProps<typeof switchVariants>['zSize']>;
