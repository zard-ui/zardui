import { cva, VariantProps } from 'class-variance-authority';

export const accordionVariants = cva('w-full', {
  variants: {},
});

export type ZardAccordionVariants = VariantProps<typeof accordionVariants>;

export const accordionItemVariants = cva('w-full border-b', {
  variants: {},
});
export type ZardAccordionItemVariants = VariantProps<typeof accordionItemVariants>;

export const accordionItemTriggerVariants = cva(
  'flex w-full items-center justify-between py-4 px-4 text-sm font-medium transition-all hover:underline text-left border-none bg-transparent cursor-pointer focus:outline-none',
  {
    variants: {},
  },
);
export type ZardAccordionItemTriggerVariants = VariantProps<typeof accordionItemTriggerVariants>;

export const accordionItemContentVariants = cva('w-full', {
  variants: {},
});
export type ZardAccordionItemContentVariants = VariantProps<typeof accordionItemContentVariants>;
