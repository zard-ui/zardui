import { cva, type VariantProps } from 'class-variance-authority';

export const dialogVariants = cva(
  [
    'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4',
    'rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 outline-none',
    'sm:max-w-sm',
  ].join(' '),
);

export const dialogHeaderVariants = cva('flex flex-col gap-2');

export const dialogTitleVariants = cva('text-base leading-none font-medium');

export const dialogDescriptionVariants = cva(
  'text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-[3px] *:[a]:hover:text-foreground',
);

export const dialogFooterVariants = cva(
  '-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end',
);

export type ZardDialogVariants = VariantProps<typeof dialogVariants>;
