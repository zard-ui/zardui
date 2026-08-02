import { cva, type VariantProps } from 'class-variance-authority';

export const commandVariants = cva(
  'flex size-full flex-col overflow-hidden rounded-xl bg-popover p-1 text-popover-foreground border shadow-md',
);

export const commandListVariants = cva(
  'no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none p-1',
);

export const commandGroupVariants = cva(
  'overflow-hidden text-foreground **:data-[slot=command-group-heading]:px-2 **:data-[slot=command-group-heading]:py-1.5 **:data-[slot=command-group-heading]:text-xs **:data-[slot=command-group-heading]:font-medium **:data-[slot=command-group-heading]:text-muted-foreground',
);

export const commandItemVariants = cva(
  [
    'group/command-item relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none transition-colors',
    'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
    'data-selected:bg-muted data-selected:text-accent-foreground',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    'data-selected:*:[svg]:text-accent-foreground',
  ].join(' '),
  {
    variants: {
      variant: {
        default: '',
        destructive: 'data-selected:bg-destructive data-selected:text-destructive-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const commandSeparatorVariants = cva('-mx-1 my-1 h-px bg-border');

export const commandShortcutVariants = cva(
  'ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-accent-foreground',
);

export type ZardCommandItemVariants = NonNullable<VariantProps<typeof commandItemVariants>['variant']>;
