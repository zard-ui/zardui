import { cva, type VariantProps } from 'class-variance-authority';

export const inputOtpVariants = cva('flex items-center gap-2 has-[:disabled]:opacity-50', {
  variants: {},
  defaultVariants: {},
});

export const inputOtpSlotVariants = cva(
  [
    'relative flex h-10 w-10 items-center justify-center',
    'border-y border-r border-input text-sm transition-all',
    'first:rounded-l-md first:border-l last:rounded-r-md',
    'focus-within:z-10 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-background',
    'disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  },
);

export const inputOtpGroupVariants = cva('flex items-center', {
  variants: {},
  defaultVariants: {},
});

export const inputOtpSeparatorVariants = cva('flex w-4 items-center justify-center text-muted-foreground', {
  variants: {},
  defaultVariants: {},
});

export type ZardInputOtpVariants = VariantProps<typeof inputOtpVariants>;
export type ZardInputOtpSlotVariants = VariantProps<typeof inputOtpSlotVariants>;
export type ZardInputOtpGroupVariants = VariantProps<typeof inputOtpGroupVariants>;
export type ZardInputOtpSeparatorVariants = VariantProps<typeof inputOtpSeparatorVariants>;
