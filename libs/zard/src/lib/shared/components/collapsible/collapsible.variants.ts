import { cva, type VariantProps } from 'class-variance-authority';

export const collapsibleVariants = cva('block');

export const collapsibleContentVariants = cva('grid transition-[grid-template-rows,visibility] duration-200 ease-out', {
  variants: {
    isOpen: {
      true: 'visible grid-rows-[1fr]',
      false: 'invisible grid-rows-[0fr]',
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});

export type ZardCollapsibleVariants = VariantProps<typeof collapsibleVariants>;
export type ZardCollapsibleContentVariants = VariantProps<typeof collapsibleContentVariants>;
