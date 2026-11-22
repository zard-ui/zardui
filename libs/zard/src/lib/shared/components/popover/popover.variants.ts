import { cva, type VariantProps } from 'class-variance-authority';

export const popoverVariants = cva('cn-popover outline-hidden');

export const popoverHeaderVariants = cva('cn-popover-header');

export const popoverTitleVariants = cva('cn-popover-title');

export const popoverDescriptionVariants = cva('cn-popover-description');

export type ZardPopoverVariants = VariantProps<typeof popoverVariants>;
