import { cva } from 'class-variance-authority';

const datePickerVariants = cva('', {
  variants: {
    zSize: {
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

export { datePickerVariants };
