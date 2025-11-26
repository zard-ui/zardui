import { cva, type VariantProps } from 'class-variance-authority';

export const loaderVariants = cva('', {
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
export type ZardLoaderVariants = VariantProps<typeof loaderVariants>;
