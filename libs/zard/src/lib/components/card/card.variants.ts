import { cva, VariantProps } from 'class-variance-authority';

export const cardVariants = cva('block rounded-lg border bg-card text-card-foreground shadow-sm w-full p-6', {
  variants: {},
});
export type ZardCardVariants = VariantProps<typeof cardVariants>;

export const cardHeaderVariants = cva('flex flex-col space-y-1.5 pb-0 gap-1.5', {
  variants: {},
});
export type ZardCardHeaderVariants = VariantProps<typeof cardHeaderVariants>;

export const cardHeaderTitleVariants = cva('text-2xl font-semibold leading-none tracking-tight', {
  variants: {},
});
export type ZardCardHeaderTitleVariants = VariantProps<typeof cardHeaderTitleVariants>;

export const cardHeaderDescriptionVariants = cva('text-sm text-muted-foreground', {
  variants: {},
});
export type ZardCardHeaderDescriptionVariants = VariantProps<typeof cardHeaderDescriptionVariants>;

export const cardBodyVariants = cva('block mt-6', {
  variants: {},
});
export type ZardCardBodyVariants = VariantProps<typeof cardBodyVariants>;
