import { cva, type VariantProps } from 'class-variance-authority';

export const breadcrumbVariants = cva('w-full', {
  variants: {
    zSize: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
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
    zSize: 'md',
    zAlign: 'start',
    zWrap: 'wrap',
  },
});
export type ZardBreadcrumbVariants = VariantProps<typeof breadcrumbVariants>;

export const breadcrumbListVariants = cva('text-muted-foreground flex flex-wrap items-center gap-1.5 break-words sm:gap-2.5', {
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
});
export type ZardBreadcrumbListVariants = VariantProps<typeof breadcrumbListVariants>;

export const breadcrumbItemVariants = cva(
  'inline-flex items-center gap-1.5 transition-colors cursor-pointer hover:text-foreground last:text-foreground last:font-normal last:pointer-events-none',
);
export type ZardBreadcrumbItemVariants = VariantProps<typeof breadcrumbItemVariants>;

export const breadcrumbSeparatorVariants = cva('select-none', {
  variants: {
    zType: {
      default: 'text-muted-foreground',
      strong: 'text-foreground',
      primary: 'text-primary',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});
export type ZardBreadcrumbSeparatorVariants = VariantProps<typeof breadcrumbSeparatorVariants>;

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
export type ZardBreadcrumbEllipsisVariants = VariantProps<typeof breadcrumbEllipsisVariants>;
