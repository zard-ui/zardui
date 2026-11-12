import { cva } from 'class-variance-authority';

export const menubarVariants = cva('flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-xs');

export const menubarTriggerVariants = cva(
  'flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50',
);
