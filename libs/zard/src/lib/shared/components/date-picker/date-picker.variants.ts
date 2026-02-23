import { cva, type VariantProps } from 'class-variance-authority';

export const datePickerVariants = cva('', {
  variants: {
    zSize: {
      xs: '',
      sm: '',
      default: '',
      lg: '',
    },
    zType: {
      default: '',
      outline: '',
      ghost: '',
    },
  },
  defaultVariants: {
    zSize: 'default',
    zType: 'outline',
  },
});

export type ZardDatePickerSizeVariants = NonNullable<VariantProps<typeof datePickerVariants>['zSize']>;
