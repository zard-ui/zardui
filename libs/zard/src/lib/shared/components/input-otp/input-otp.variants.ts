import { cva, type VariantProps } from 'class-variance-authority';

export const inputOtpVariants = cva('flex items-center has-disabled:opacity-50');

export const inputOtpGroupVariants = cva(
  'flex items-center rounded-lg has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 [&>z-input-otp-slot:first-child_input]:rounded-l-lg [&>z-input-otp-slot:first-child_input]:border-l [&>z-input-otp-slot:last-child_input]:rounded-r-lg dark:has-aria-invalid:ring-destructive/40',
);

export const inputOtpSlotVariants = cva(
  'relative flex items-center justify-center border-y border-r border-input bg-transparent text-center transition-all outline-none focus:z-10 focus:border-ring focus:ring-3 focus:ring-ring/50 disabled:cursor-not-allowed aria-invalid:border-destructive data-active:z-10 data-active:border-ring data-active:ring-3 data-active:ring-ring/50 data-active:aria-invalid:border-destructive data-active:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-active:aria-invalid:ring-destructive/40',
  {
    variants: {
      zSize: {
        sm: 'size-7 text-xs',
        default: 'size-8 text-sm',
        lg: 'size-10 text-base',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export const inputOtpSeparatorVariants = cva('flex items-center', {
  variants: {
    zSize: {
      sm: "[&_svg:not([class*='size-'])]:size-3",
      default: "[&_svg:not([class*='size-'])]:size-4",
      lg: "[&_svg:not([class*='size-'])]:size-5",
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardInputOtpSize = NonNullable<VariantProps<typeof inputOtpSlotVariants>['zSize']>;
export type ZardInputOtpVariants = VariantProps<typeof inputOtpVariants>;
export type ZardInputOtpSlotVariants = VariantProps<typeof inputOtpSlotVariants>;
export type ZardInputOtpGroupVariants = VariantProps<typeof inputOtpGroupVariants>;
export type ZardInputOtpSeparatorVariants = VariantProps<typeof inputOtpSeparatorVariants>;
