import { cva, type VariantProps } from 'class-variance-authority';

export const alertVariants = cva('relative w-full rounded-lg border px-4 py-3 text-sm flex items-center gap-3', {
  variants: {
    zType: {
      default: 'bg-card text-card-foreground',
      destructive: 'text-destructive bg-card',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});

export const alertIconVariants = cva('shrink-0 self-start !text-base');

export const alertTitleVariants = cva('font-medium tracking-tight leading-none');

export const alertDescriptionVariants = cva('text-sm leading-relaxed mt-1', {
  variants: {
    zType: {
      default: 'text-muted-foreground',
      destructive: 'text-destructive/90',
    },
  },
  defaultVariants: {
    zType: 'default',
  },
});

export type ZardAlertVariants = VariantProps<typeof alertVariants>;
export type ZardAlertIconVariants = VariantProps<typeof alertIconVariants>;
export type ZardAlertTitleVariants = VariantProps<typeof alertTitleVariants>;
export type ZardAlertDescriptionVariants = VariantProps<typeof alertDescriptionVariants>;
