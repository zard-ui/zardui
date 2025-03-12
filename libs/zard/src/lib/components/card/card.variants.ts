import { cva, VariantProps } from 'class-variance-authority';

export const cardVariants = cva('block rounded-lg border bg-card text-card-foreground shadow-sm w-full', {
  variants: {},
});
export type ZardCardVariants = VariantProps<typeof cardVariants>;

export const cardHeaderVariants = cva('flex flex-col space-y-1.5 p-6 pb-0 gap-1.5', {
  variants: {},
});
export type ZardCardHeaderVariants = VariantProps<typeof cardHeaderVariants>;

export const cardBodyVariants = cva('p-6', {
  variants: {},
});
export type ZardCardBodyVariants = VariantProps<typeof cardBodyVariants>;
