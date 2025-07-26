import { cva, type VariantProps } from 'class-variance-authority';

export const sliderVariants = cva(
  'relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
  {
    variants: {
      orientation: {
        horizontal: 'items-center',
        vertical: 'flex-col h-full min-h-44 w-auto',
      },
      disabled: {
        true: 'opacity-50 pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
      disabled: false,
    },
  },
);

export type SliderVariants = VariantProps<typeof sliderVariants>;

export const sliderTrackVariants = cva(
  'flex bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
  {
    variants: {
      zOrientation: {
        horizontal: 'h-1.5 w-full',
        vertical: 'w-1.5 h-full min-h-44',
      },
    },
    defaultVariants: {
      zOrientation: 'horizontal',
    },
  },
);

export type SliderTrackVariants = VariantProps<typeof sliderTrackVariants>;

export const sliderRangeVariants = cva('bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full', {
  variants: {
    zOrientation: {
      horizontal: 'h-full',
      vertical: 'w-full',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type SliderRangeVariants = VariantProps<typeof sliderRangeVariants>;

export const sliderThumbVariants = cva(
  'border-primary bg-background ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
);

export type SliderThumbVariants = VariantProps<typeof sliderThumbVariants>;

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

export type SliderOrientationVariants = VariantProps<typeof sliderOrientationVariants>;
