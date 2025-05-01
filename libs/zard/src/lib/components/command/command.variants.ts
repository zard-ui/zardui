import { cva, VariantProps } from 'class-variance-authority';

export const commandVariants = cva('w-full', {
  variants: {
    zSize: {
      sm: 'max-w-xl',
      default: 'max-w-2xl',
      lg: 'max-w-3xl',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardCommandVariants = VariantProps<typeof commandVariants>;
