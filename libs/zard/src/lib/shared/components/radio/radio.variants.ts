import { cva } from 'class-variance-authority';

export const radioVariants = cva(
  'cursor-[unset] peer appearance-none rounded-full border border-input bg-background shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 aspect-square shrink-0 size-4',
);

export const radioLabelVariants = cva('text-sm empty:hidden peer-disabled:opacity-50 peer-disabled:cursor-not-allowed');
