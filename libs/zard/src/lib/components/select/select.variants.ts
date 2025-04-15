import { cva, VariantProps } from 'class-variance-authority';

export const selectVariants = cva(
  'flex w-full items-center justify-between rounded-md border font-normal border-input bg-transparent ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      zSize: {
        default: 'h-10 px-4 py-2 text-base md:text-sm',
        sm: 'h-9 px-3 py-1.5 text-sm',
        lg: 'h-11 px-5 py-2.5 text-base',
      },
      zStatus: {
        default: '',
        error: 'border-destructive focus-visible:ring-destructive',
        warning: 'border-yellow-500 focus-visible:ring-yellow-500',
        success: 'border-green-500 focus-visible:ring-green-500',
      },
      zBorderless: {
        true: 'border-0 focus-visible:ring-0 focus-visible:ring-offset-0',
      },
      zFullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      zSize: 'default',
      zStatus: 'default',
      zFullWidth: false,
    },
  },
);

export const selectOptionVariants = cva('relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-base md:text-sm outline-none', {
  variants: {
    zSelected: {
      true: 'bg-accent text-accent-foreground',
      false: 'hover:bg-accent/30',
    },
    zDisabled: {
      true: 'pointer-events-none opacity-50',
      false: '',
    },
  },
  defaultVariants: {
    zSelected: false,
    zDisabled: false,
  },
});

export type ZardSelectVariants = VariantProps<typeof selectVariants>;
export type ZardSelectOptionVariants = VariantProps<typeof selectOptionVariants>;
