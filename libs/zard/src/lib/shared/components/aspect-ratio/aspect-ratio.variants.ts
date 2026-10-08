import { cva, type VariantProps } from 'class-variance-authority';

export const aspectRatioVariants = cva('relative block');
export type ZardAspectRatioVariants = VariantProps<typeof aspectRatioVariants>;
