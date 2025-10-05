import { cva, VariantProps } from 'class-variance-authority';

export const emptyVariants = cva('', {
  variants: {
    zSize: {
      default: {
        image: 'mx-auto w-40',
        svg: 'w-16 h-10 mx-auto',
        description: 'text-sm text-center text-neutral-800 dark:text-neutral-300',
      },
      small: {
        image: 'mx-auto w-28',
        svg: 'w-12 h-8 mx-auto',
        description: 'text-xs text-center text-neutral-800 dark:text-neutral-300',
      },
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardEmptyVariants = VariantProps<typeof emptyVariants>;
