import { cva, VariantProps } from 'class-variance-authority';

export const menuContainerVariants = cva('relative inline-block text-left', {
  variants: {},
  defaultVariants: {},
});

export const menuDropdownVariants = cva('absolute z-10 mt-2 rounded-md ring-1 bg-white dark:bg-black ring-accent ring-opacity-5 dark:ring-opacity-10 focus:outline-none', {
  variants: {
    zSize: {
      default: 'w-56',
      sm: 'w-48',
      lg: 'w-64',
    },
    zPlacement: {
      'bottom-start': 'origin-top-left left-0',
      'bottom-end': 'origin-top-right right-0',
      'top-start': 'origin-bottom-left bottom-full left-0 mb-2',
      'top-end': 'origin-bottom-right bottom-full right-0 mb-2',
    },
  },
  defaultVariants: {
    zSize: 'default',
    zPlacement: 'bottom-end',
  },
});

export type ZardMenuPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
export type ZardMenuVariants = VariantProps<typeof menuDropdownVariants>;
