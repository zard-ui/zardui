import { cva, type VariantProps } from 'class-variance-authority';

export const comboboxVariants = cva('cn-combobox group/combobox', {
  variants: {
    zWidth: {
      default: 'cn-combobox-width-default',
      sm: 'cn-combobox-width-sm',
      md: 'cn-combobox-width-md',
      lg: 'cn-combobox-width-lg',
      full: 'cn-combobox-width-full',
    },
  },
  defaultVariants: {
    zWidth: 'default',
  },
});

export const comboboxValueVariants = cva('cn-combobox-value');

/**
 * `contents` keeps the host out of the layout, so the inner `z-input-group` behaves as a direct
 * child of whatever wraps the input — the root or, in popup mode, the content popup, whose
 * `*:data-[slot=input-group]:*` rules would otherwise never reach it.
 */
export const comboboxInputHostVariants = cva('cn-combobox-input-host');

export const comboboxInputGroupVariants = cva('cn-combobox-input-group');

export const comboboxTriggerVariants = cva('cn-combobox-trigger', {
  variants: {
    /** A standalone trigger lives outside a `z-input-group`, so the input-group-only rules do not apply. */
    zStandalone: {
      false: 'cn-combobox-trigger-standalone-false',
      true: '',
    },
  },
  defaultVariants: {
    zStandalone: false,
  },
});

export const comboboxClearVariants = cva('');

export const comboboxContentVariants = cva(
  'cn-combobox-content cn-menu-target cn-menu-translucent group/combobox-content',
);

export const comboboxListVariants = cva('cn-combobox-list');

export const comboboxItemVariants = cva(
  'cn-combobox-item outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      zVariant: {
        default: '',
        destructive: 'cn-combobox-item-variant-destructive',
      },
    },
    defaultVariants: {
      zVariant: 'default',
    },
  },
);

export const comboboxItemIndicatorVariants = cva('cn-combobox-item-indicator');

export const comboboxGroupVariants = cva('cn-combobox-group');

export const comboboxLabelVariants = cva('cn-combobox-label');

export const comboboxEmptyVariants = cva('cn-combobox-empty');

export const comboboxSeparatorVariants = cva('cn-combobox-separator');

export const comboboxChipsVariants = cva('cn-combobox-chips');

export const comboboxChipVariants = cva('cn-combobox-chip');

export const comboboxChipRemoveVariants = cva('cn-combobox-chip-remove');

export const comboboxChipsInputVariants = cva('cn-combobox-chips-input outline-none');

export type ZardComboboxWidthVariants = NonNullable<VariantProps<typeof comboboxVariants>['zWidth']>;
export type ZardComboboxItemVariants = NonNullable<VariantProps<typeof comboboxItemVariants>['zVariant']>;
export type ZardComboboxTriggerStandaloneVariants = NonNullable<
  VariantProps<typeof comboboxTriggerVariants>['zStandalone']
>;
