import { cva, type VariantProps } from 'class-variance-authority';

export const aspectRatioVariants = cva('cn-aspect-ratio');
export type ZardAspectRatioVariants = VariantProps<typeof aspectRatioVariants>;
