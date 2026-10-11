import { cva, type VariantProps } from 'class-variance-authority';

export const breadcrumbVariants = cva('cn-breadcrumb', {
  variants: {
    zSize: {
      sm: 'cn-breadcrumb-size-sm',
      md: 'cn-breadcrumb-size-md',
      lg: 'cn-breadcrumb-size-lg',
    },
  },
  defaultVariants: {
    zSize: 'md',
  },
});
export type ZardBreadcrumbSizeVariants = NonNullable<VariantProps<typeof breadcrumbVariants>['zSize']>;

export const breadcrumbListVariants = cva('cn-breadcrumb-list', {
  variants: {
    zAlign: {
      start: 'cn-breadcrumb-list-align-start',
      center: 'cn-breadcrumb-list-align-center',
      end: 'cn-breadcrumb-list-align-end',
    },
    zWrap: {
      wrap: 'cn-breadcrumb-list-wrap-wrap',
      nowrap: 'cn-breadcrumb-list-wrap-nowrap',
    },
  },
  defaultVariants: {
    zAlign: 'start',
    zWrap: 'wrap',
  },
});
export type ZardBreadcrumbAlignVariants = NonNullable<VariantProps<typeof breadcrumbListVariants>['zAlign']>;
export type ZardBreadcrumbWrapVariants = NonNullable<VariantProps<typeof breadcrumbListVariants>['zWrap']>;

export const breadcrumbItemVariants = cva('cn-breadcrumb-item');
export type ZardBreadcrumbItemVariants = VariantProps<typeof breadcrumbItemVariants>;

export const breadcrumbLinkVariants = cva('cn-breadcrumb-link');
export type ZardBreadcrumbLinkVariants = VariantProps<typeof breadcrumbLinkVariants>;

export const breadcrumbPageVariants = cva('cn-breadcrumb-page');
export type ZardBreadcrumbPageVariants = VariantProps<typeof breadcrumbPageVariants>;

export const breadcrumbSeparatorVariants = cva('cn-breadcrumb-separator');
export type ZardBreadcrumbSeparatorVariants = VariantProps<typeof breadcrumbSeparatorVariants>;

export const breadcrumbEllipsisVariants = cva('cn-breadcrumb-ellipsis', {
  variants: {
    zColor: {
      muted: 'cn-breadcrumb-ellipsis-color-muted',
      strong: 'cn-breadcrumb-ellipsis-color-strong',
    },
  },
  defaultVariants: {
    zColor: 'muted',
  },
});
export type ZardBreadcrumbEllipsisColorVariants = NonNullable<
  VariantProps<typeof breadcrumbEllipsisVariants>['zColor']
>;
