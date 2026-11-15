import { cva } from 'class-variance-authority';

export const menubarVariants = cva('flex h-8 items-center gap-0.5 rounded-lg border p-0.75');

export const menubarTriggerVariants = cva(
  'flex items-center rounded-sm px-1.5 py-0.5 text-sm font-medium outline-hidden select-none hover:bg-muted focus-visible:bg-muted aria-expanded:bg-muted data-disabled:pointer-events-none data-disabled:opacity-50',
);
