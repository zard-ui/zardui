import { cva, VariantProps } from 'class-variance-authority';

export const emptyVariants = cva('flex flex-col items-center justify-center text-center', {
  variants: {
    zSize: {
      default: 'text-sm [&_img]:w-40 [&_svg]:w-16 [&_svg]:h-10',
      sm: 'text-xs [&_img]:w-28 [&_svg]:w-12 [&_svg]:h-8',
      lg: 'text-base [&_img]:w-52 [&_svg]:w-20 [&_svg]:h-12',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardEmptyVariants = VariantProps<typeof emptyVariants>;
