import { cva, type VariantProps } from 'class-variance-authority';

export const toggleVariants = cva(
  'cn-toggle group/toggle outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      zType: {
        default: 'cn-toggle-variant-default',
        outline: 'cn-toggle-variant-outline',
      },
      zSize: {
        default: 'cn-toggle-size-default',
        sm: 'cn-toggle-size-sm',
        lg: 'cn-toggle-size-lg',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
    },
  },
);
export type ZardToggleTypeVariants = NonNullable<VariantProps<typeof toggleVariants>['zType']>;
export type ZardToggleSizeVariants = NonNullable<VariantProps<typeof toggleVariants>['zSize']>;
