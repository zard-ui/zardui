import { cva } from 'class-variance-authority';

export const sliderVariants = cva(
  'relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col',
);

export const sliderTrackVariants = cva(
  'bg-muted relative grow overflow-hidden rounded-full data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1',
);

export const sliderRangeVariants = cva('bg-primary absolute select-none data-horizontal:h-full data-vertical:w-full');

export const sliderThumbVariants = cva(
  'relative block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50',
);

export const sliderOrientationVariants = cva('absolute', {
  variants: {
    zOrientation: {
      horizontal: 'translate-x-[-50%]',
      vertical: 'translate-y-[50%]',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});
