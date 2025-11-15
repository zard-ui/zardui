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
      horizontal: '-ml-4 mr-0.5',
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
      horizontal: 'pl-4',
      vertical: 'pt-5',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselPreviousButtonVariants = cva('absolute size-8 rounded-full', {
  variants: {
    zOrientation: {
      horizontal: 'top-1/2 -left-12.5 -translate-y-1/2',
      vertical: '-top-12 left-1/2 -translate-x-1/2 rotate-90',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export const carouselNextButtonVariants = cva('absolute size-8 rounded-full', {
  variants: {
    zOrientation: {
      horizontal: 'top-1/2 -right-12 -translate-y-1/2',
      vertical: '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type ZardCarouselOrientationVariants = NonNullable<VariantProps<typeof carouselVariants>['zOrientation']>;
export type ZardCarouselControlsVariants = NonNullable<VariantProps<typeof carouselVariants>['zControls']>;
