import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const comboboxVariants = cva('group/combobox relative block', {
  variants: {
    zWidth: {
      default: 'w-50',
      sm: 'w-37.5',
      md: 'w-62.5',
      lg: 'w-87.5',
      full: 'w-full',
    },
  },
  defaultVariants: {
    zWidth: 'default',
  },
});

export const comboboxValueVariants = cva('block truncate text-sm');

/**
 * `contents` keeps the host out of the layout, so the inner `z-input-group` behaves as a direct
 * child of whatever wraps the input — the root or, in popup mode, the content popup, whose
 * `*:data-[slot=input-group]:*` rules would otherwise never reach it.
 */
export const comboboxInputHostVariants = cva('contents');

export const comboboxInputGroupVariants = cva('w-auto');

export const comboboxTriggerVariants = cva("[&_svg:not([class*='size-'])]:size-4", {
  variants: {
    /** A standalone trigger lives outside a `z-input-group`, so the input-group-only rules do not apply. */
    zStandalone: {
      false: 'group-has-data-[slot=combobox-clear]/input-group:hidden aria-expanded:bg-transparent',
      true: '',
    },
  },
  defaultVariants: {
    zStandalone: false,
  },
});

export const comboboxClearVariants = cva('');

export const comboboxContentVariants = cva(
  mergeClasses(
    'group/combobox-content relative max-h-(--z-combobox-available-height) w-(--z-combobox-anchor-width)',
    'max-w-(--z-combobox-available-width) min-w-(--z-combobox-anchor-width)',
    'origin-(--z-combobox-transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground',
    'shadow-md ring-1 ring-foreground/10 duration-100',
    'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
    '*:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8',
    '*:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30',
    '*:data-[slot=input-group]:shadow-none',
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
  ),
);

export const comboboxListVariants = cva(
  mergeClasses(
    'no-scrollbar block scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0',
    'max-h-[min(calc(--spacing(72)-(--spacing(9))),calc(var(--z-combobox-available-height)-(--spacing(9))))]',
  ),
);

export const comboboxItemVariants = cva(
  mergeClasses(
    'relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pe-8 ps-1.5 text-sm',
    'outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground',
    'not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground',
    'data-disabled:pointer-events-none data-disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ),
  {
    variants: {
      zVariant: {
        default: '',
        destructive: 'text-destructive data-highlighted:bg-destructive/10 data-highlighted:text-destructive',
      },
    },
    defaultVariants: {
      zVariant: 'default',
    },
  },
);

export const comboboxItemIndicatorVariants = cva(
  'pointer-events-none absolute inset-e-2 flex size-4 items-center justify-center',
);

export const comboboxGroupVariants = cva('block');

export const comboboxLabelVariants = cva('block px-2 py-1.5 text-xs text-muted-foreground');

export const comboboxEmptyVariants = cva(
  mergeClasses(
    'hidden w-full justify-center py-2 text-center text-sm text-muted-foreground',
    'group-data-empty/combobox-content:flex',
  ),
);

export const comboboxSeparatorVariants = cva('-mx-1 my-1 block h-px bg-border');

export const comboboxChipsVariants = cva(
  mergeClasses(
    'flex min-h-8 flex-wrap items-center gap-1 rounded-lg border border-input bg-transparent bg-clip-padding',
    'px-2.5 py-1 text-sm transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50',
    'has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20',
    'has-data-[slot=combobox-chip]:px-1 dark:bg-input/30 dark:has-aria-invalid:border-destructive/50',
    'dark:has-aria-invalid:ring-destructive/40',
  ),
);

export const comboboxChipVariants = cva(
  mergeClasses(
    'flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs',
    'font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none',
    'has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pe-0',
  ),
);

export const comboboxChipRemoveVariants = cva('-ms-1 opacity-50 hover:opacity-100');

export const comboboxChipsInputVariants = cva('min-w-16 flex-1 bg-transparent outline-none');

export type ZardComboboxWidthVariants = NonNullable<VariantProps<typeof comboboxVariants>['zWidth']>;
export type ZardComboboxItemVariants = NonNullable<VariantProps<typeof comboboxItemVariants>['zVariant']>;
export type ZardComboboxTriggerStandaloneVariants = NonNullable<
  VariantProps<typeof comboboxTriggerVariants>['zStandalone']
>;
