import { cva, VariantProps } from 'class-variance-authority';

export const breadcrumbVariants = cva('px-3 group-last:hidden', {
  variants: {},
});
export type ZardBreadcrumbVariants = VariantProps<typeof breadcrumbVariants>;

export const breadcrumbItemsVariants = cva('group', {
  variants: {},
});
export type ZardBreadcrumbItemVariants = VariantProps<typeof breadcrumbVariants>;
