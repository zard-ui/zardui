import { cva, VariantProps } from 'class-variance-authority';

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

export const breadcrumbItemVariants = cva('flex items-center gap-1.5 transition-colors', {
  variants: {
    zType: {
      default: '',
      muted: 'text-muted-foreground',
      bold: 'font-semibold text-foreground',
      subtle: 'text-sm text-muted-foreground hover:text-foreground',
    },
    zShape: {
      default: '',
      square: 'px-1 py-0.5 rounded-none',
      rounded: 'px-2 py-0.5 rounded-md',
    },
  },
  defaultVariants: {
    zType: 'default',
    zShape: 'default',
  },
});
export type ZardBreadcrumbItemVariants = VariantProps<typeof breadcrumbItemVariants>;

export const breadcrumbLinkVariants = cva('flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', {
  variants: {
    zType: {
      default: 'hover:text-foreground',
      underline: 'underline text-foreground hover:no-underline',
      subtle: 'text-muted-foreground hover:text-foreground',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});
export type ZardBreadcrumbLinkVariants = VariantProps<typeof breadcrumbLinkVariants>;

export const breadcrumbPageVariants = cva('flex items-center gap-1 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2', {
  variants: {
    zType: {
      default: 'text-foreground',
      underline: 'underline text-foreground hover:no-underline',
      subtle: 'text-muted-foreground hover:text-foreground',
      current: 'font-semibold text-foreground cursor-default ' + 'hover:text-foreground focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});
export type ZardBreadcrumbPageVariants = VariantProps<typeof breadcrumbPageVariants>;

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
