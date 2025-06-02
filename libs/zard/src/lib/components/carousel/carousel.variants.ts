import { cva, VariantProps } from 'class-variance-authority';

export const carouselVariants = cva('', {
  variants: {
    zOrientation: {
      horizontal: '',
      vertical: 'h-full',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselContentVariants = cva('flex', {
  variants: {
    zOrientation: {
      horizontal: '-ml-4', // Negative spacing to be compensated by item padding
      vertical: '-mt-4 flex-col', // Negative spacing to be compensated by item padding
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselItemVariants = cva('basis-full', {
  variants: {
    zOrientation: {
      horizontal: 'pl-4', // Compensates for content negative margin
      vertical: 'pt-4', // Compensates for content negative margin
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type ZardCarouselVariants = VariantProps<typeof carouselVariants>;
export type ZardCarouselContentVariants = VariantProps<typeof carouselContentVariants>;
export type ZardCarouselItemVariants = VariantProps<typeof carouselItemVariants>;
