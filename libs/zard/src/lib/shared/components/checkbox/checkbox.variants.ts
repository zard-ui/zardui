import { cva } from 'class-variance-authority';

export const checkboxVariants = cva(
  'cursor-[unset] peer size-4 shrink-0 appearance-none rounded-[4px] border border-input shadow-sm transition outline-none hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 checked:border-primary checked:bg-primary checked:text-primary-foreground dark:checked:bg-primary',
);

export const checkboxLabelVariants = cva('cursor-[unset] text-sm text-current empty:hidden select-none');
