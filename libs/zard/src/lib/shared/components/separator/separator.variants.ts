import { cva, type VariantProps } from 'class-variance-authority';

export const separatorVariants = cva('cn-separator', {
  variants: {
    zOrientation: {
      horizontal: '',
      vertical: '',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type ZardSeparatorVariants = VariantProps<typeof separatorVariants>;
