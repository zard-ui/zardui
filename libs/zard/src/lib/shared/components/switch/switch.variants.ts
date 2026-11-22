import { cva, type VariantProps } from 'class-variance-authority';

export const switchVariants = cva('cn-switch peer outline-none disabled:opacity-50', {
  variants: {
    zSize: {
      default: 'cn-switch-size-default',
      sm: 'cn-switch-size-sm',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardSwitchSizeVariants = NonNullable<VariantProps<typeof switchVariants>['zSize']>;
