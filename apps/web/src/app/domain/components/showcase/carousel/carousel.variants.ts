import { cva } from 'class-variance-authority';

export const carouselVariants = cva('relative w-full', {
  variants: {
    orientation: {
      horizontal: '',
      vertical: 'flex-col',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const carouselContentVariants = cva('overflow-hidden embla', {
  variants: {
    orientation: {
      horizontal: '',
      vertical: 'h-full',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const carouselViewportVariants = cva('flex embla__container', {
  variants: {
    orientation: {
      horizontal: '',
      vertical: 'flex-col',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export const carouselItemVariants = cva('min-w-0 shrink-0 grow-0 basis-auto', {
  variants: {
    orientation: {
      horizontal: '',
      vertical: 'min-h-0',
    },
  },
  defaultVariants: {
    orientation: 'horizontal',
  },
});

export type CarouselVariants = {
  orientation: 'horizontal' | 'vertical';
};
