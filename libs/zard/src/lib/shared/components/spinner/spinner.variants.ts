import { cva, type VariantProps } from 'class-variance-authority';

export const spinnerVariants = cva('', {
  variants: {
    zSize: {
      default: 'size-6',
      sm: 'size-4',
      lg: 'size-8',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});
export type ZardSpinnerVariants = VariantProps<typeof spinnerVariants>;
