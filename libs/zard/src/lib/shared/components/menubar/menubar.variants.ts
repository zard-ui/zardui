import { cva } from 'class-variance-authority';

export const menubarVariants = cva('cn-menubar flex items-center');

export const menubarTriggerVariants = cva(
  'cn-menubar-trigger flex items-center outline-hidden select-none data-disabled:pointer-events-none data-disabled:opacity-50',
);
