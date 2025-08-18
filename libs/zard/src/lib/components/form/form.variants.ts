import { cva, VariantProps } from 'class-variance-authority';

export const formFieldVariants = cva('grid gap-2');

export const formLabelVariants = cva('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', {
  variants: {
    zRequired: {
      true: "after:content-['*'] after:ml-0.5 after:text-red-500",
    },
  },
});

export const formControlVariants = cva('');

export const formMessageVariants = cva('text-sm', {
  variants: {
    zType: {
      default: 'text-muted-foreground',
      error: 'text-red-500',
      success: 'text-green-500',
      warning: 'text-yellow-500',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});

export type ZardFormFieldVariants = VariantProps<typeof formFieldVariants>;
export type ZardFormLabelVariants = VariantProps<typeof formLabelVariants>;
export type ZardFormControlVariants = VariantProps<typeof formControlVariants>;
export type ZardFormMessageVariants = VariantProps<typeof formMessageVariants>;
