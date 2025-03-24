import { cva, VariantProps } from 'class-variance-authority';

export const radioVariants = cva(
  'cursor-[unset] peer appearance-none border transition shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      zType: {
        default: 'border-primary checked:bg-primary',
        destructive: 'border-destructive checked:bg-destructive',
        secondary: 'border-secondary checked:bg-secondary',
      },
      zSize: {
        default: 'h-4 w-4',
        sm: 'h-3 w-3',
        lg: 'h-6 w-6',
      },
      zShape: {
        default: 'rounded-full',
        circle: 'rounded-full',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
      zShape: 'default',
    },
  },
);

export const radioLabelVariants = cva('cursor-[unset] text-current empty:hidden', {
  variants: {
    zSize: {
      default: 'text-base',
      sm: 'text-sm',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardRadioVariants = VariantProps<typeof radioVariants>;
export type ZardRadioLabelVariants = VariantProps<typeof radioLabelVariants>;
