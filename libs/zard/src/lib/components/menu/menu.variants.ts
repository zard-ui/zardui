import { cva, VariantProps } from 'class-variance-authority';

export const menuContainerVariants = cva('relative inline-block text-left', {
  variants: {},
  defaultVariants: {},
});

export const menuDropdownVariants = cva('absolute z-10 mt-2 origin-top-right rounded-md ring-1 ring-black ring-opacity-5 focus:outline-none', {
  variants: {
    size: {
      default: 'w-56',
      sm: 'w-48',
      lg: 'w-64',
    },
    variant: {
      default: 'bg-white shadow-lg',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
});

export type ZardMenuSize = 'default' | 'sm' | 'lg';
export type ZardMenuVariant = 'default';
export type ZardMenuVariants = VariantProps<typeof menuDropdownVariants>;
