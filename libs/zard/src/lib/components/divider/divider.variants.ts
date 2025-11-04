import { cva, type VariantProps } from 'class-variance-authority';

export const dividerVariants = cva('bg-border block', {
  variants: {
    zOrientation: {
      horizontal: 'h-px w-full',
      vertical: 'w-px h-full inline-block',
    },
    zSpacing: {
      none: '',
      sm: '',
      default: '',
      lg: '',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
    zSpacing: 'default',
  },
  compoundVariants: [
    {
      zOrientation: 'horizontal',
      zSpacing: 'sm',
      class: 'my-2',
    },
    {
      zOrientation: 'horizontal',
      zSpacing: 'default',
      class: 'my-4',
    },
    {
      zOrientation: 'horizontal',
      zSpacing: 'lg',
      class: 'my-8',
    },
    {
      zOrientation: 'vertical',
      zSpacing: 'sm',
      class: 'mx-2',
    },
    {
      zOrientation: 'vertical',
      zSpacing: 'default',
      class: 'mx-4',
    },
    {
      zOrientation: 'vertical',
      zSpacing: 'lg',
      class: 'mx-8',
    },
  ],
});

export type ZardDividerVariants = VariantProps<typeof dividerVariants>;
