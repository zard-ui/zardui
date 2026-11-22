import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  'cn-button group/button outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      zType: {
        default: 'cn-button-variant-default',
        destructive: 'cn-button-variant-destructive',
        outline: 'cn-button-variant-outline',
        secondary: 'cn-button-variant-secondary',
        ghost: 'cn-button-variant-ghost',
        link: 'cn-button-variant-link',
      },
      zSize: {
        default: 'cn-button-size-default',
        xs: 'cn-button-size-xs',
        sm: 'cn-button-size-sm',
        lg: 'cn-button-size-lg',
        icon: 'cn-button-size-icon',
        'icon-xs': 'cn-button-size-icon-xs',
        'icon-sm': 'cn-button-size-icon-sm',
        'icon-lg': 'cn-button-size-icon-lg',
      },
      zShape: {
        default: 'cn-button-shape-default',
        circle: 'cn-button-shape-circle',
        square: 'cn-button-shape-square',
      },
      zLoading: {
        true: 'cn-button-loading-true pointer-events-none',
      },
      zDisabled: {
        true: 'cn-button-disabled-true pointer-events-none',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
      zShape: 'default',
    },
  },
);
export type ZardButtonShapeVariants = NonNullable<VariantProps<typeof buttonVariants>['zShape']>;
export type ZardButtonSizeVariants = NonNullable<VariantProps<typeof buttonVariants>['zSize']>;
export type ZardButtonTypeVariants = NonNullable<VariantProps<typeof buttonVariants>['zType']>;
