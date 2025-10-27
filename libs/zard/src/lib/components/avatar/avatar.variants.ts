import { cva, type VariantProps } from 'class-variance-authority';

export const avatarVariants = cva('relative flex flex-row items-center justify-center box-content cursor-default bg-muted', {
  variants: {
    zSize: {
      sm: 'w-8 h-8',
      default: 'w-10 h-10',
      md: 'w-12 h-12',
      lg: 'w-14 h-14',
      xl: 'w-16 h-16',
    },
    zShape: {
      circle: 'rounded-full',
      rounded: 'rounded-md',
      square: 'rounded-none',
    },
  },
  defaultVariants: {
    zSize: 'default',
    zShape: 'circle',
  },
});

export const imageVariants = cva('relative object-cover object-center w-full h-full z-10', {
  variants: {
    zShape: {
      circle: 'rounded-full',
      rounded: 'rounded-md',
      square: 'rounded-none',
    },
  },
  defaultVariants: {
    zShape: 'circle',
  },
});

export const avatarGroupVariants = cva('flex items-center [&_img]:ring-2 [&_img]:ring-background', {
  variants: {
    zOrientation: {
      horizontal: 'flex-row -space-x-3',
      vertical: 'flex-col -space-y-3',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type ZardAvatarVariants = VariantProps<typeof avatarVariants>;
export type ZardImageVariants = VariantProps<typeof imageVariants>;
export type ZardAvatarGroupVariants = VariantProps<typeof avatarGroupVariants>;
