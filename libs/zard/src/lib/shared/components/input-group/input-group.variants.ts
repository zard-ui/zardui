import { cva, type VariantProps } from 'class-variance-authority';

export const inputGroupVariants = cva(
  // Input/textarea overrides when used as input-group-control
  'cn-input-group group/input-group outline-none',
);

export const inputGroupAddonVariants = cva('cn-input-group-addon select-none', {
  variants: {
    zAlign: {
      'inline-start': 'cn-input-group-addon-align-inline-start',
      'inline-end': 'cn-input-group-addon-align-inline-end',
      'block-start': 'cn-input-group-addon-align-block-start',
      'block-end': 'cn-input-group-addon-align-block-end',
    },
  },
  defaultVariants: {
    zAlign: 'inline-start',
  },
});

export const inputGroupButtonVariants = cva(
  'cn-input-group-button outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      zVariant: {
        default: 'cn-input-group-button-variant-default',
        destructive: 'cn-input-group-button-variant-destructive',
        outline: 'cn-input-group-button-variant-outline',
        secondary: 'cn-input-group-button-variant-secondary',
        ghost: 'cn-input-group-button-variant-ghost',
        link: 'cn-input-group-button-variant-link',
      },
      zSize: {
        xs: 'cn-input-group-button-size-xs',
        sm: 'cn-input-group-button-size-sm',
        'icon-xs': 'cn-input-group-button-size-icon-xs',
        'icon-sm': 'cn-input-group-button-size-icon-sm',
      },
    },
    defaultVariants: {
      zVariant: 'ghost',
      zSize: 'xs',
    },
  },
);

export const inputGroupTextVariants = cva('cn-input-group-text [&_svg]:pointer-events-none');

export type ZardInputGroupAddonAlignVariants = NonNullable<VariantProps<typeof inputGroupAddonVariants>['zAlign']>;
export type ZardInputGroupButtonSizeVariants = NonNullable<VariantProps<typeof inputGroupButtonVariants>['zSize']>;
export type ZardInputGroupButtonVariantVariants = NonNullable<
  VariantProps<typeof inputGroupButtonVariants>['zVariant']
>;
