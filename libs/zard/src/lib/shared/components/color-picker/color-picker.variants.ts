import { cva, type VariantProps } from 'class-variance-authority';

import type { ZardButtonSizeVariants } from '@/shared/components/button/button.variants';

/**
 * Transparency checkerboard drawn with theme tokens, so it reads in light and dark mode.
 * Sits under every color fill that can carry alpha (trigger swatch, alpha track, presets).
 */
const checkerboard =
  'bg-[repeating-conic-gradient(var(--color-muted)_0_25%,var(--color-background)_0_50%)] bg-size-[8px_8px]';

/**
 * Host wrapper. With the value text the trigger is a full-width field, like `z-date-picker`;
 * without it the trigger is a square swatch button, so the host shrinks to fit it.
 */
export const colorPickerVariants = cva('flex flex-col', {
  variants: {
    zShowValue: {
      true: 'w-[212px]',
      false: 'w-fit',
    },
  },
  defaultVariants: {
    zShowValue: false,
  },
});

/** Trigger button. Height, colors and focus ring come from `buttonVariants`, so only the delta lives here. */
export const colorPickerTriggerVariants = cva('font-normal', {
  variants: {
    zShowValue: {
      true: 'w-full justify-start text-left',
      false: '',
    },
  },
  defaultVariants: {
    zShowValue: false,
  },
});

export const colorPickerSwatchVariants = cva(
  `relative shrink-0 overflow-hidden rounded-sm ring-1 ring-foreground/15 ring-inset ${checkerboard}`,
  {
    variants: {
      zSize: {
        sm: 'size-3.5',
        default: 'size-4',
        lg: 'size-5',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export const colorPickerPanelVariants = cva('w-64 gap-3 p-3');

/** The saturation (x) / brightness (y) area. Its hue background is set inline. */
export const colorPickerAreaVariants = cva(
  'relative h-36 w-full cursor-crosshair touch-none rounded-md outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50',
);

export const colorPickerTrackVariants = cva(
  'relative h-3 w-full cursor-pointer touch-none rounded-full outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50',
  {
    variants: {
      zChannel: {
        hue: 'bg-[linear-gradient(to_right,#f00_0%,#ff0_17%,#0f0_33%,#0ff_50%,#00f_67%,#f0f_83%,#f00_100%)]',
        alpha: checkerboard,
      },
    },
    defaultVariants: {
      zChannel: 'hue',
    },
  },
);

/** Thumb shared by the area and both tracks; positioned inline through `left` / `top`. */
export const colorPickerThumbVariants = cva(
  'pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3),0_1px_3px_rgb(0_0_0/0.3)]',
);

export const colorPickerPresetVariants = cva(
  `relative size-6 overflow-hidden rounded-md ring-1 ring-foreground/15 ring-inset outline-none ${checkerboard} transition-transform hover:scale-110 focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:ring-2 aria-pressed:ring-ring`,
);

export type ZardColorPickerSizeVariants = Extract<ZardButtonSizeVariants, 'sm' | 'default' | 'lg'>;
export type ZardColorPickerVariants = VariantProps<typeof colorPickerVariants>;
