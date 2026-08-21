import { cva, type VariantProps } from 'class-variance-authority';

export const aspectRatioVariants = cva('block');
export type ZardAspectRatioVariants = VariantProps<typeof aspectRatioVariants>;
