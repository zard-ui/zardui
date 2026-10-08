import { cva, type VariantProps } from 'class-variance-authority';

export const carouselVariants = cva('overflow-hidden', {
  variants: {
    zOrientation: {
      horizontal: '',
      vertical: 'h-full',
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

export const carouselContentVariants = cva('flex', {
  variants: {
    zOrientation: {
      horizontal: '-ms-4',
      vertical: '-mt-4 flex-col',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselItemVariants = cva('min-w-0 shrink-0 grow-0 basis-full', {
  variants: {
    zOrientation: {
      horizontal: 'ps-4',
      vertical: 'pt-4',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselPreviousButtonVariants = cva('absolute size-8 touch-manipulation rounded-full px-0', {
  variants: {
    zOrientation: {
      horizontal: 'top-1/2 ltr:-left-12 rtl:-right-12 -translate-y-1/2 rtl:rotate-180',
      vertical: '-top-12 left-1/2 -translate-x-1/2 rotate-90',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselNextButtonVariants = cva('absolute size-8 touch-manipulation rounded-full px-0', {
  variants: {
    zOrientation: {
      horizontal: 'top-1/2 ltr:-right-12 rtl:-left-12 -translate-y-1/2 rtl:rotate-180',
      vertical: '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type ZardCarouselOrientationVariants = NonNullable<VariantProps<typeof carouselVariants>['zOrientation']>;
export type ZardCarouselControlsVariants = NonNullable<VariantProps<typeof carouselVariants>['zControls']>;
