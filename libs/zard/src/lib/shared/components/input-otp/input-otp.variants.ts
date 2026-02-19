import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const inputOtpVariants = cva(mergeClasses('flex items-center has-[:disabled]:opacity-50'), {
  variants: {
    zSize: {
      sm: 'gap-1 text-xs',
      default: 'gap-2 text-sm',
      lg: 'gap-3 text-base',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export const inputOtpGroupVariants = cva(
  mergeClasses(
    'flex items-center',
    '[&>z-input-otp-slot:first-child_input]:rounded-l-md [&>z-input-otp-slot:first-child_input]:border-l',
    '[&>z-input-otp-slot:last-child_input]:rounded-r-md',
  ),
);

export const inputOtpSlotVariants = cva(
  mergeClasses(
    'relative flex items-center justify-center',
    'border-y border-r border-input bg-transparent text-center',
    'shadow-xs transition-[color,box-shadow] outline-none',
    'focus:z-10 focus:border-ring focus:ring-ring/50 focus:ring-[3px]',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'placeholder:text-muted-foreground',
    'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
    'data-[active]:border-ring data-[active]:ring-ring/50 data-[active]:ring-[3px] data-[active]:z-10',
  ),
  {
    variants: {
      zSize: {
        sm: 'h-8 w-8 text-xs',
        default: 'h-9 w-9 text-sm',
        lg: 'h-10 w-10 text-base',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export const inputOtpSeparatorVariants = cva('flex items-center justify-center text-muted-foreground', {
  variants: {
    zSize: {
      sm: '[&_svg]:size-3',
      default: '[&_svg]:size-4',
      lg: '[&_svg]:size-5',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardInputOtpSizeVariants = NonNullable<VariantProps<typeof inputOtpVariants>['zSize']>;
export type ZardInputOtpSlotVariants = VariantProps<typeof inputOtpSlotVariants>;
export type ZardInputOtpGroupVariants = VariantProps<typeof inputOtpGroupVariants>;
export type ZardInputOtpSeparatorVariants = VariantProps<typeof inputOtpSeparatorVariants>;
