import { cva, type VariantProps } from 'class-variance-authority';

export const badgeVariants = cva('cn-badge [&>svg]:pointer-events-none', {
  variants: {
    zType: {
      default: 'cn-badge-variant-default',
      secondary: 'cn-badge-variant-secondary',
      destructive: 'cn-badge-variant-destructive',
      outline: 'cn-badge-variant-outline',
      ghost: 'cn-badge-variant-ghost',
      link: 'cn-badge-variant-link',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});

export type ZardBadgeTypeVariants = NonNullable<VariantProps<typeof badgeVariants>['zType']>;
