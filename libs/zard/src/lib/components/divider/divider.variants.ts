import { cva, VariantProps } from 'class-variance-authority';

export const dividerVariants = cva('bg-border', {
  variants: {
    zOrientation: {
      horizontal: 'h-px w-full my-4',
      vertical: 'w-px h-full mx-4',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type ZardDividerVariants = VariantProps<typeof dividerVariants>;
