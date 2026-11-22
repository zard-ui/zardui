import { cva } from 'class-variance-authority';

export const sliderVariants = cva('cn-slider touch-none select-none data-disabled:opacity-50');

export const sliderTrackVariants = cva('cn-slider-track');

export const sliderRangeVariants = cva('cn-slider-range select-none');

export const sliderThumbVariants = cva('cn-slider-thumb select-none disabled:pointer-events-none disabled:opacity-50');

export const sliderOrientationVariants = cva('cn-slider-orientation', {
  variants: {
    zOrientation: {
      horizontal: 'cn-slider-orientation-orientation-horizontal',
      vertical: 'cn-slider-orientation-orientation-vertical',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});
