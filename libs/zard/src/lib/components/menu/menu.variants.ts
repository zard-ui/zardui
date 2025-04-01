import { cva, VariantProps } from 'class-variance-authority';

export const menuContainerVariants = cva('relative inline-block text-left', {
  variants: {},
  defaultVariants: {},
});

export const menuDropdownVariants = cva(
  'absolute z-10 mt-2 origin-top-right rounded-md ring-1 bg-white dark:bg-black ring-accent ring-opacity-5 dark:ring-opacity-10 focus:outline-none',
  {
    variants: {
      zSize: {
        default: 'w-56',
        sm: 'w-48',
        lg: 'w-64',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export type ZardMenuVariant = 'default';
export type ZardMenuVariants = VariantProps<typeof menuDropdownVariants>;
