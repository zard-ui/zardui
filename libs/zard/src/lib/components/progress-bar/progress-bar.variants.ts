import { cva, type VariantProps } from 'class-variance-authority';

export const containerProgressBarVariants = cva('w-full transition-all', {
  variants: {
    zType: {
      default: 'bg-primary/20',
      destructive: 'bg-destructive/20',
      accent: 'bg-chart-1/20',
    },
    zSize: {
      default: 'h-2',
      sm: 'h-3',
      lg: 'h-5',
    },
    zShape: {
      default: 'rounded-full',
      square: 'rounded-none',
    },
    zIndeterminate: {
      true: 'relative',
    },
  },

  defaultVariants: {
    zType: 'default',
    zSize: 'default',
    zShape: 'default',
  },
});
export type ZardProgressBarSizeVariants = NonNullable<VariantProps<typeof containerProgressBarVariants>['zSize']>;

export const progressBarVariants = cva('h-full transition-all', {
  variants: {
    zType: {
      default: 'bg-primary',
      destructive: 'bg-destructive',
      accent: 'bg-chart-1',
    },
    zShape: {
      default: 'rounded-full',
      square: 'rounded-none',
    },
    zIndeterminate: {
      true: 'absolute animate-[indeterminate_1.5s_infinite_ease-out]',
    },
  },
  defaultVariants: {
    zType: 'default',
    zShape: 'default',
  },
});
export type ZardProgressBarTypeVariants = NonNullable<VariantProps<typeof progressBarVariants>['zType']>;
export type ZardProgressBarShapeVariants = NonNullable<VariantProps<typeof progressBarVariants>['zShape']>;
