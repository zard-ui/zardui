import { cva, VariantProps } from 'class-variance-authority';

export const alertDialogVariants = cva('fixed z-50 w-full max-w-[calc(100%-2rem)] border bg-background shadow-lg rounded-lg sm:max-w-lg', {
  variants: {
    zType: {
      default: '',
      destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      warning: 'border-warning/50 text-warning dark:border-warning [&>svg]:text-warning',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});

export type ZardAlertDialogVariants = VariantProps<typeof alertDialogVariants>;
