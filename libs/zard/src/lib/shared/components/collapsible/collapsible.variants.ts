import { cva, type VariantProps } from 'class-variance-authority';

export const collapsibleVariants = cva('', {
  variants: {
    // `z-collapsible` is a custom element and would default to `display: inline`. As an attribute on
    // an existing element (the `asChild` case) the host's own display has to win instead.
    isElement: {
      true: 'cn-collapsible-is-element-true',
      false: '',
    },
  },
  defaultVariants: {
    isElement: false,
  },
});

export const collapsibleContentVariants = cva('cn-collapsible-content', {
  variants: {
    isOpen: {
      true: 'cn-collapsible-content-is-open-true',
      false: 'cn-collapsible-content-is-open-false',
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});

export type ZardCollapsibleVariants = VariantProps<typeof collapsibleVariants>;
export type ZardCollapsibleContentVariants = VariantProps<typeof collapsibleContentVariants>;
