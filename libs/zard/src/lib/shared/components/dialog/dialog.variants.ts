import { cva, type VariantProps } from 'class-variance-authority';

export const dialogVariants = cva('cn-dialog outline-none');

/** Classes of the mask behind a dialog, shared by the declarative form and the service. */
export const DIALOG_BACKDROP_CLASSES = ['bg-black/10', 'supports-backdrop-filter:backdrop-blur-xs'];

export const dialogHeaderVariants = cva('cn-dialog-header');

export const dialogTitleVariants = cva('cn-dialog-title cn-font-heading');

export const dialogDescriptionVariants = cva('cn-dialog-description');

export const dialogFooterVariants = cva('cn-dialog-footer');

export type ZardDialogVariants = VariantProps<typeof dialogVariants>;
