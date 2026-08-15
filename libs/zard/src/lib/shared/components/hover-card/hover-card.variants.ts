import { cva, type VariantProps } from 'class-variance-authority';

export const hoverCardVariants = cva(
  [
    'z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none',
    'origin-(--z-hover-card-transform-origin)',
    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',
  ].join(' '),
);
export type ZardHoverCardVariants = VariantProps<typeof hoverCardVariants>;
