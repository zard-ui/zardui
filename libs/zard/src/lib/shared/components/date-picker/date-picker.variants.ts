import { cva, type VariantProps } from 'class-variance-authority';

import type { ZardButtonSizeVariants } from '@/shared/components/button/button.variants';

/**
 * Host wrapper. The width lives here — the trigger is `w-full` — so a single
 * `class="w-44"` on `<z-date-picker />` resizes the whole thing, and dropping it
 * into a `<div z-field>` lets the field own the width instead.
 */
export const datePickerVariants = cva('cn-date-picker');

/**
 * Trigger button. Everything else (height, colors, focus ring) comes from
 * `buttonVariants` through `<button z-button>`, so only the delta lives here.
 */
export const datePickerTriggerVariants = cva('cn-date-picker-trigger', {
  variants: {
    zIcon: {
      chevron: 'cn-date-picker-trigger-icon-chevron',
      calendar: 'cn-date-picker-trigger-icon-calendar',
      none: 'cn-date-picker-trigger-icon-none',
    },
  },
  defaultVariants: {
    zIcon: 'chevron',
  },
});

export type ZardDatePickerIconVariants = NonNullable<VariantProps<typeof datePickerTriggerVariants>['zIcon']>;

/** The date picker exposes the height scale of the button, minus the icon-only sizes. */
export type ZardDatePickerSizeVariants = Extract<ZardButtonSizeVariants, 'xs' | 'sm' | 'default' | 'lg'>;
