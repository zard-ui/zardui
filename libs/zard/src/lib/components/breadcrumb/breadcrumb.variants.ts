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
  'text-muted-foreground flex flex-wrap items-center gap-1.5 wrap-break-word sm:gap-2.5',
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

export const breadcrumbItemVariants = cva(
  'inline-flex items-center gap-1.5 transition-colors cursor-pointer hover:text-foreground last:text-foreground last:font-normal last:pointer-events-none',
);
export type ZardBreadcrumbItemVariants = VariantProps<typeof breadcrumbItemVariants>;

export const breadcrumbEllipsisVariants = cva('flex', {
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
