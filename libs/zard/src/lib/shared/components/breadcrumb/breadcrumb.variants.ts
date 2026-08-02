import { cva, type VariantProps } from 'class-variance-authority';

export const breadcrumbVariants = cva('w-full', {
  variants: {
    zSize: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
  },
  defaultVariants: {
    zSize: 'md',
  },
});
export type ZardBreadcrumbSizeVariants = NonNullable<VariantProps<typeof breadcrumbVariants>['zSize']>;

export const breadcrumbListVariants = cva(
  'text-muted-foreground flex flex-wrap items-center gap-1.5 break-words sm:gap-2.5',
  {
    variants: {
      zAlign: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
      },
      zWrap: {
        wrap: 'flex-wrap',
        nowrap: 'flex-nowrap',
      },
    },
    defaultVariants: {
      zAlign: 'start',
      zWrap: 'wrap',
    },
  },
);
export type ZardBreadcrumbAlignVariants = NonNullable<VariantProps<typeof breadcrumbListVariants>['zAlign']>;
export type ZardBreadcrumbWrapVariants = NonNullable<VariantProps<typeof breadcrumbListVariants>['zWrap']>;

export const breadcrumbItemVariants = cva('inline-flex items-center gap-1.5');
export type ZardBreadcrumbItemVariants = VariantProps<typeof breadcrumbItemVariants>;

export const breadcrumbLinkVariants = cva('transition-colors hover:text-foreground');
export type ZardBreadcrumbLinkVariants = VariantProps<typeof breadcrumbLinkVariants>;

export const breadcrumbPageVariants = cva('font-normal text-foreground');
export type ZardBreadcrumbPageVariants = VariantProps<typeof breadcrumbPageVariants>;

export const breadcrumbSeparatorVariants = cva(
  'text-muted-foreground [&_svg]:size-3.5 [&_ng-icon]:flex! [&_ng-icon]:items-center! [&_ng-icon]:size-3.5!',
);
export type ZardBreadcrumbSeparatorVariants = VariantProps<typeof breadcrumbSeparatorVariants>;

export const breadcrumbEllipsisVariants = cva('flex size-9 items-center justify-center', {
  variants: {
    zColor: {
      muted: 'text-muted-foreground',
      strong: 'text-foreground',
    },
  },
  defaultVariants: {
    zColor: 'muted',
  },
});
export type ZardBreadcrumbEllipsisColorVariants = NonNullable<
  VariantProps<typeof breadcrumbEllipsisVariants>['zColor']
>;
