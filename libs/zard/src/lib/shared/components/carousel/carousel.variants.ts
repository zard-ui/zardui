import { cva, type VariantProps } from 'class-variance-authority';

export const carouselVariants = cva('cn-carousel', {
  variants: {
    zOrientation: {
      horizontal: '',
      vertical: 'cn-carousel-orientation-vertical',
    },
    zControls: {
      none: '',
      button: '',
      dot: '',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselContentVariants = cva('cn-carousel-content', {
  variants: {
    zOrientation: {
      horizontal: 'cn-carousel-content-orientation-horizontal',
      vertical: 'cn-carousel-content-orientation-vertical',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselItemVariants = cva('cn-carousel-item', {
  variants: {
    zOrientation: {
      horizontal: 'cn-carousel-item-orientation-horizontal',
      vertical: 'cn-carousel-item-orientation-vertical',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselPreviousButtonVariants = cva('cn-carousel-previous-button touch-manipulation', {
  variants: {
    zOrientation: {
      horizontal: 'cn-carousel-previous-button-orientation-horizontal',
      vertical: 'cn-carousel-previous-button-orientation-vertical',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselNextButtonVariants = cva('cn-carousel-next-button touch-manipulation', {
  variants: {
    zOrientation: {
      horizontal: 'cn-carousel-next-button-orientation-horizontal',
      vertical: 'cn-carousel-next-button-orientation-vertical',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type ZardCarouselOrientationVariants = NonNullable<VariantProps<typeof carouselVariants>['zOrientation']>;
export type ZardCarouselControlsVariants = NonNullable<VariantProps<typeof carouselVariants>['zControls']>;
