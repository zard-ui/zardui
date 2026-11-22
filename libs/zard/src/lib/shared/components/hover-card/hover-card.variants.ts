import { cva, type VariantProps } from 'class-variance-authority';

/** Base visual styles and placement-aware animations for hover card content. */
export const hoverCardVariants = cva('cn-hover-card outline-none');

/** Variant properties accepted by the hover card style generator. */
export type ZardHoverCardVariants = VariantProps<typeof hoverCardVariants>;
