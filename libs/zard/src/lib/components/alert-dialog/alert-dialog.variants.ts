import { cva, VariantProps } from 'class-variance-authority';

export const alertDialogVariants = cva('fixed z-50 w-full max-w-[calc(100%-2rem)] border bg-background shadow-lg rounded-lg');

export type ZardAlertDialogVariants = VariantProps<typeof alertDialogVariants>;
