import { cva, type VariantProps } from 'class-variance-authority';

export const alertDialogVariants = cva('cn-alert-dialog group/alert-dialog-content outline-none', {
  variants: {
    zSize: {
      default: '',
      sm: '',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

/** Classes of the mask behind an alert dialog, shared by the declarative form and the service. */
// A marker, so the style decides how dark and how blurred the mask is. The CDK takes one class per entry.
export const ALERT_DIALOG_BACKDROP_CLASSES = 'cn-alert-dialog-overlay'.split(' ').filter(Boolean);

export const alertDialogHeaderVariants = cva('cn-alert-dialog-header');

export const alertDialogTitleVariants = cva('cn-alert-dialog-title cn-font-heading');

export const alertDialogDescriptionVariants = cva('cn-alert-dialog-description');

export const alertDialogFooterVariants = cva('cn-alert-dialog-footer');

export const alertDialogMediaVariants = cva('cn-alert-dialog-media');

export type ZardAlertDialogVariants = VariantProps<typeof alertDialogVariants>;
export type ZardAlertDialogSizeVariants = NonNullable<VariantProps<typeof alertDialogVariants>['zSize']>;
