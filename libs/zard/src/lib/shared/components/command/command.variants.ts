import { cva, type VariantProps } from 'class-variance-authority';

export const commandVariants = cva('cn-command');

export const commandListVariants = cva('cn-command-list');

export const commandGroupVariants = cva('cn-command-group');

export const commandItemVariants = cva(
  'cn-command-item group/command-item outline-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: '',
        // Tinted background, destructive text — the same treatment as the
        // destructive button and dropdown item. It used to be a solid
        // `bg-destructive` with `text-destructive-foreground`, a token no theme
        // ever defined, so the text stayed dark on red.
        destructive: 'cn-command-item-variant-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export const commandSeparatorVariants = cva('cn-command-separator');

export const commandShortcutVariants = cva('cn-command-shortcut');

export type ZardCommandItemVariants = NonNullable<VariantProps<typeof commandItemVariants>['variant']>;
