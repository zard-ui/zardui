import { cva, type VariantProps } from 'class-variance-authority';

export const skeletonVariants = cva('cn-skeleton');
export type ZardSkeletonVariants = VariantProps<typeof skeletonVariants>;
