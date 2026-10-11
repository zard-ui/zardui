import { cva, type VariantProps } from 'class-variance-authority';

export const accordionItemVariants = cva('cn-accordion-item', {
  variants: {},
  defaultVariants: {},
});

export const accordionTriggerVariants = cva(
  'cn-accordion-trigger group outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {},
    defaultVariants: {},
  },
);

export const accordionContentVariants = cva('cn-accordion-content', {
  variants: {
    isOpen: {
      true: 'cn-accordion-content-is-open-true',
      false: 'cn-accordion-content-is-open-false',
    },
  },
  defaultVariants: {
    isOpen: false,
  },
});

export type ZardAccordionItemVariants = VariantProps<typeof accordionItemVariants>;
export type ZardAccordionTriggerVariants = VariantProps<typeof accordionTriggerVariants>;
export type ZardAccordionContentVariants = VariantProps<typeof accordionContentVariants>;
