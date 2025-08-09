import { cva, type VariantProps } from 'class-variance-authority';

export const comboboxVariants = cva('', {
  variants: {
    zWidth: {
      default: 'w-[200px]',
      sm: 'w-[150px]',
      md: 'w-[250px]',
      lg: 'w-[350px]',
      full: 'w-full',
    },
  },
  defaultVariants: {
    zWidth: 'default',
  },
});

export type ZardComboboxVariants = VariantProps<typeof comboboxVariants>;
