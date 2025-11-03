import { cva, type VariantProps } from 'class-variance-authority';

export const dividerVariants = cva('bg-border shrink-0', {
  variants: {
    zOrientation: {
      horizontal: 'h-px w-full',
      vertical: 'w-px h-full',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type ZardDividerVariants = VariantProps<typeof dividerVariants>;
