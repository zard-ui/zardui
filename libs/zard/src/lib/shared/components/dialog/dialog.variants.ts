import { cva, type VariantProps } from 'class-variance-authority';

export const dialogVariants = cva('cn-dialog outline-none');

/** Classes of the mask behind a dialog, shared by the declarative form and the service. */
// A marker, so the style decides how dark and how blurred the mask is. The CDK takes one class per entry.
export const DIALOG_BACKDROP_CLASSES = 'cn-dialog-overlay'.split(' ').filter(Boolean);

export const dialogHeaderVariants = cva('cn-dialog-header');

export const dialogTitleVariants = cva('cn-dialog-title cn-font-heading');

export const dialogDescriptionVariants = cva('cn-dialog-description');

export const dialogFooterVariants = cva('cn-dialog-footer');

export type ZardDialogVariants = VariantProps<typeof dialogVariants>;
