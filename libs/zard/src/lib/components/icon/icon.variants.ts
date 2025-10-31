import { cva, type VariantProps } from 'class-variance-authority';

export const iconVariants = cva('flex items-center justify-center', {
  variants: {
    zSize: {
      sm: 'size-3',
      default: 'size-3.5',
      lg: 'size-4',
      xl: 'size-5',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardIconVariants = VariantProps<typeof iconVariants>;
