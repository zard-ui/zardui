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
      true: 'w-full justify-start text-start',
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

/**
 * Changes made from the keyboard, a preset or the text field glide; a drag must follow the pointer, so the
 * panel carries `data-dragging` while one is in progress and the transitions below switch off.
 */
const glide = 'duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';
const glideUnlessDragging = `${glide} group-data-dragging/color-picker:transition-none`;

/** Wide enough for the longest text value, `oklch(… / …)`, to show whole in the field. */
export const colorPickerPanelVariants = cva('group/color-picker w-72 gap-3 p-3');

/** Segmented control picking the format of the text field. */
export const colorPickerFormatGroupVariants = cva('relative isolate flex rounded-md bg-muted p-0.5');

/** The pill behind the active tab. Tabs share the width equally, so it only needs a `translateX` per index. */
export const colorPickerFormatIndicatorVariants = cva(
  'absolute inset-y-0.5 inset-s-0.5 -z-10 rounded-sm bg-background shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
);

export const colorPickerFormatVariants = cva(
  'h-6 flex-1 rounded-sm font-mono text-[11px] font-medium text-muted-foreground outline-none transition-colors duration-200 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:text-foreground',
);

/** The saturation (x) / brightness (y) area. Hue and gradients are set inline: x follows the reading direction. */
export const colorPickerAreaVariants = cva(
  `relative h-36 w-full cursor-crosshair touch-none rounded-md outline-none select-none transition-[background-color] focus-visible:ring-3 focus-visible:ring-ring/50 ${glideUnlessDragging}`,
);

export const colorPickerTrackVariants = cva(
  'relative h-3 w-full cursor-pointer touch-none rounded-full outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50',
  {
    variants: {
      zChannel: {
        // The hue gradient is set inline, since its direction follows the reading direction.
        hue: '',
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
  `pointer-events-none absolute top-1/2 size-4 -translate-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3),0_1px_3px_rgb(0_0_0/0.3)] transition-[left,top,background-color,scale] ${glide} group-data-dragging/color-picker:transition-[scale] data-active:scale-125`,
);

/** The color layer over a checkerboard (trigger swatch, presets), fading between colors. */
export const colorPickerFillVariants = cva(
  `absolute inset-0 transition-[background-color] ${glide} data-dragging:transition-none`,
);

export const colorPickerPresetVariants = cva(
  `relative size-6 overflow-hidden rounded-md ring-1 ring-foreground/15 ring-inset outline-none ${checkerboard} transition-[scale,box-shadow] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-110 active:scale-95 focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:ring-2 aria-pressed:ring-ring motion-reduce:transition-none`,
);

export type ZardColorPickerSizeVariants = Extract<ZardButtonSizeVariants, 'sm' | 'default' | 'lg'>;
export type ZardColorPickerVariants = VariantProps<typeof colorPickerVariants>;
