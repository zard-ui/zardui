import { cva, type VariantProps } from 'class-variance-authority';

export const hoverCardVariants = cva(
  'z-50 w-64 rounded-md border bg-popover p-4 ' +
    'text-popover-foreground shadow-md outline-none ' +
    'animate-in fade-in-0 zoom-in-95',
);
export type ZardHoverCardVariants = VariantProps<typeof hoverCardVariants>;
