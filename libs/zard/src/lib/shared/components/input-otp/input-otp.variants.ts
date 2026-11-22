import { cva, type VariantProps } from 'class-variance-authority';

export const inputOtpVariants = cva('cn-input-otp');

export const inputOtpGroupVariants = cva('cn-input-otp-group');

export const inputOtpSlotVariants = cva('cn-input-otp-slot disabled:cursor-not-allowed', {
  variants: {
    zSize: {
      sm: 'cn-input-otp-slot-size-sm',
      default: 'cn-input-otp-slot-size-default',
      lg: 'cn-input-otp-slot-size-lg',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const inputOtpSeparatorVariants = cva('cn-input-otp-separator', {
  variants: {
    zSize: {
      sm: 'cn-input-otp-separator-size-sm',
      default: 'cn-input-otp-separator-size-default',
      lg: 'cn-input-otp-separator-size-lg',
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
