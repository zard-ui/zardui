import { cva, type VariantProps } from 'class-variance-authority';

import type { ZardButtonSizeVariants } from '@/shared/components/button/button.variants';

/**
 * Host wrapper. The width lives here — the trigger is `w-full` — so a single
 * `class="w-44"` on `<z-date-picker />` resizes the whole thing, and dropping it
 * into a `<div z-field>` lets the field own the width instead.
 */
export const datePickerVariants = cva('flex w-[212px] flex-col');

/**
 * Trigger button. Everything else (height, colors, focus ring) comes from
 * `buttonVariants` through `<button z-button>`, so only the delta lives here.
 */
export const datePickerTriggerVariants = cva('w-full font-normal data-[empty=true]:text-muted-foreground', {
  variants: {
    zIcon: {
      chevron: 'justify-between text-left',
      calendar: 'justify-start text-left',
      none: 'justify-start text-left',
    },
  },
  defaultVariants: {
    zIcon: 'chevron',
  },
});

export type ZardDatePickerIconVariants = NonNullable<VariantProps<typeof datePickerTriggerVariants>['zIcon']>;

/** The date picker exposes the height scale of the button, minus the icon-only sizes. */
export type ZardDatePickerSizeVariants = Extract<ZardButtonSizeVariants, 'xs' | 'sm' | 'default' | 'lg'>;
