import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva('cn-alert group/alert', {
  variants: {
    zType: {
      default: 'cn-alert-variant-default',
      destructive: 'cn-alert-variant-destructive',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});

export const alertIconVariants = cva('cn-alert-icon');

export const alertActionVariants = cva('cn-alert-action');

export const alertTitleVariants = cva('cn-alert-title');

export const alertDescriptionVariants = cva('cn-alert-description', {
  variants: {
    zType: {
      default: 'cn-alert-description-variant-default',
      destructive: '',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});

export type ZardAlertTypeVariants = NonNullable<VariantProps<typeof alertVariants>['zType']>;
