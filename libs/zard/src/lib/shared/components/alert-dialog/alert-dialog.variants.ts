import { cva, type VariantProps } from 'class-variance-authority';

export const alertDialogVariants = cva(
  [
    'group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4',
    'rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 outline-none',
    'data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm',
  ].join(' '),
  {
    variants: {
      zSize: {
        default: '',
        sm: '',
      },
    },
    defaultVariants: {
      zSize: 'default',
    },
  },
);

export const alertDialogHeaderVariants = cva(
  [
    'grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center',
    'has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4',
    'sm:group-data-[size=default]/alert-dialog-content:place-items-start',
    'sm:group-data-[size=default]/alert-dialog-content:text-left',
    'sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]',
  ].join(' '),
);

export const alertDialogTitleVariants = cva(
  [
    'text-base font-medium',
    'sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
  ].join(' '),
);

export const alertDialogDescriptionVariants = cva(
  [
    'text-sm text-balance text-muted-foreground md:text-pretty',
    '*:[a]:underline *:[a]:underline-offset-[3px] *:[a]:hover:text-foreground',
  ].join(' '),
);

export const alertDialogFooterVariants = cva(
  [
    '-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4',
    'group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2',
    'sm:flex-row sm:justify-end',
  ].join(' '),
);

export const alertDialogMediaVariants = cva(
  [
    'mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted',
    'sm:group-data-[size=default]/alert-dialog-content:row-span-2',
    "*:[svg:not([class*='size-'])]:size-6",
  ].join(' '),
);

export type ZardAlertDialogVariants = VariantProps<typeof alertDialogVariants>;
export type ZardAlertDialogSizeVariants = NonNullable<VariantProps<typeof alertDialogVariants>['zSize']>;
