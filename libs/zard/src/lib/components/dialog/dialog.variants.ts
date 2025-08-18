import { cva, VariantProps } from 'class-variance-authority';

export const dialogVariants = cva(
  'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg rounded-lg max-w-[calc(100%-2rem)] sm:max-w-[425px] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out',
);
export type ZardDialogVariants = VariantProps<typeof dialogVariants>;
