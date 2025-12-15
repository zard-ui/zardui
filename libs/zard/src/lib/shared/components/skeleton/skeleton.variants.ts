import { cva, type VariantProps } from 'class-variance-authority';

export const skeletonVariants = cva('bg-accent animate-pulse rounded-md');
export type ZardSkeletonVariants = VariantProps<typeof skeletonVariants>;
