import { cva, type VariantProps } from 'class-variance-authority';

export const treeVariants = cva('flex flex-col text-sm', {
  variants: {},
  defaultVariants: {},
});

export const treeNodeVariants = cva('flex flex-col', {
  variants: {
    disabled: {
      true: 'opacity-50 pointer-events-none',
      false: '',
    },
  },
  defaultVariants: {
    disabled: false,
  },
});

export const treeNodeToggleVariants = cva(
  'inline-flex size-4 shrink-0 items-center justify-center rounded-sm transition-transform duration-200 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      isExpanded: {
        true: 'rotate-90',
        false: 'rotate-0',
      },
    },
    defaultVariants: {
      isExpanded: false,
    },
  },
);

export const treeNodeContentVariants = cva(
  'flex flex-1 items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer select-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  {
    variants: {
      isSelected: {
        true: 'bg-accent text-accent-foreground',
        false: '',
      },
    },
    defaultVariants: {
      isSelected: false,
    },
  },
);

export const treeNodeChildrenVariants = cva('grid transition-all duration-200 ease-in-out', {
  variants: {
    isExpanded: {
      true: 'grid-rows-[1fr]',
      false: 'grid-rows-[0fr]',
    },
  },
  defaultVariants: {
    isExpanded: false,
  },
});

export type ZardTreeVariants = VariantProps<typeof treeVariants>;
export type ZardTreeNodeVariants = VariantProps<typeof treeNodeVariants>;
export type ZardTreeNodeToggleVariants = VariantProps<typeof treeNodeToggleVariants>;
export type ZardTreeNodeContentVariants = VariantProps<typeof treeNodeContentVariants>;
export type ZardTreeNodeChildrenVariants = VariantProps<typeof treeNodeChildrenVariants>;
