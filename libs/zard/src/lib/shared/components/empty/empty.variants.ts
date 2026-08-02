import { cva } from 'class-variance-authority';

export const emptyVariants = cva(
  'flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance',
  {
    variants: {},
  },
);

export const emptyHeaderVariants = cva('flex max-w-sm flex-col items-center gap-2', {
  variants: {},
});

export const emptyImageVariants = cva(
  'mb-2 flex shrink-0 items-center justify-center bg-transparent [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {},
  },
);

export const emptyIconVariants = cva(
  `bg-muted text-foreground mb-2 flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
  {
    variants: {},
  },
);

export const emptyTitleVariants = cva('text-sm font-medium tracking-tight', {
  variants: {},
});

export const emptyDescriptionVariants = cva(
  'text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4',
  {
    variants: {},
  },
);

export const emptyActionsVariants = cva(
  'flex w-full max-w-sm min-w-0 items-center justify-center gap-2 text-sm text-balance',
  {
    variants: {},
  },
);
