import { cva, type VariantProps } from 'class-variance-authority';

export const dropdownContentVariants = cva('cn-dropdown-menu-content cn-menu-target cn-menu-translucent outline-none');

export const dropdownItemVariants = cva(
  'cn-dropdown-menu-item select-none outline-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: '',
        destructive: 'cn-dropdown-menu-item-variant-destructive',
      },
      inset: {
        true: 'cn-dropdown-menu-item-inset-true',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      inset: false,
    },
  },
);

export const dropdownSubContentVariants = cva(
  'cn-dropdown-menu-sub-content cn-menu-target cn-menu-translucent outline-none',
);

export const dropdownSubTriggerVariants = cva(
  'cn-dropdown-menu-sub-trigger select-none outline-none data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      inset: {
        true: 'cn-dropdown-menu-sub-trigger-inset-true',
        false: '',
      },
    },
    defaultVariants: {
      inset: false,
    },
  },
);

export const dropdownLabelVariants = cva('cn-dropdown-menu-label', {
  variants: {
    inset: {
      true: 'cn-dropdown-menu-label-inset-true',
      false: '',
    },
  },
  defaultVariants: {
    inset: false,
  },
});

export type ZardDropdownItemVariants = VariantProps<typeof dropdownItemVariants>;
export type ZardDropdownItemTypeVariants = NonNullable<ZardDropdownItemVariants['variant']>;
