import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const codeBlockVariants = cva(
  'cn-code-block group/code-block relative flex w-full min-w-0 flex-col overflow-hidden',
  {
    variants: {
      zType: {
        default: 'cn-code-block-variant-default',
        destructive: 'cn-code-block-variant-destructive',
      },
      zSize: {
        default: '',
        sm: '',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
    },
  },
);

export type ZardCodeBlockTypeVariants = NonNullable<VariantProps<typeof codeBlockVariants>['zType']>;
export type ZardCodeBlockSizeVariants = NonNullable<VariantProps<typeof codeBlockVariants>['zSize']>;

export const codeBlockHeaderVariants = cva(
  mergeClasses(
    'cn-code-block-header flex min-w-0 shrink-0 items-center text-muted-foreground *:has-[>[data-slot=code-block-title]]:min-w-0',
    'group-data-[variant=destructive]/code-block:text-destructive',
  ),
);

export const codeBlockTitleVariants = cva(
  mergeClasses(
    'cn-code-block-title min-w-0 truncate text-foreground',
    'group-data-[variant=destructive]/code-block:text-destructive',
    '[&_ng-icon]:me-1.5 [&_ng-icon]:inline-block [&_ng-icon]:align-middle! [&_svg]:pointer-events-none',
  ),
);

export const codeBlockActionsVariants = cva(
  mergeClasses(
    'cn-code-block-actions ms-auto flex shrink-0 items-center *:data-[slot=button]:hover:bg-foreground/5 dark:*:data-[slot=button]:hover:bg-foreground/10',
    // Without a header the actions float over the top end of the block until it is hovered or focused.
    '[[data-slot=code-block]>&]:absolute [[data-slot=code-block]>&]:z-10 [[data-slot=code-block]>&]:m-0',
    '[[data-slot=code-block]>&]:opacity-0 [[data-slot=code-block]>&]:transition-opacity [[data-slot=code-block]>&]:group-focus-within/code-block:opacity-100 [[data-slot=code-block]>&]:group-hover/code-block:opacity-100 [[data-slot=code-block]>&]:pointer-coarse:opacity-100',
    '[[data-slot=code-block]>&]:**:data-[slot=code-block-copy-button]:bg-background [[data-slot=code-block]>&]:**:data-[slot=code-block-copy-button]:ring-1 [[data-slot=code-block]>&]:**:data-[slot=code-block-copy-button]:ring-foreground/10',
  ),
);

export const codeBlockContentVariants = cva(
  mergeClasses(
    'cn-code-block-content block min-h-0 min-w-0 scroll-fade-x scrollbar-thin overflow-auto text-start font-mono outline-none',
  ),
  {
    variants: {
      zWrap: {
        true: 'scroll-fade-y wrap-anywhere whitespace-pre-wrap',
        false: 'whitespace-pre',
      },
    },
    defaultVariants: {
      zWrap: false,
    },
  },
);

export const codeBlockCodeVariants = cva('grid min-h-lh min-w-max content-start', {
  variants: {
    zWrap: {
      true: 'min-w-0',
      false: '',
    },
    zLineNumbers: {
      true: 'grid-cols-[auto_1fr]',
      false: '',
    },
  },
  defaultVariants: {
    zWrap: false,
    zLineNumbers: false,
  },
});

export const codeBlockLineVariants = cva(
  mergeClasses(
    'cn-code-block-line relative block min-h-lh',
    // The `+` / `−` marker sits in the gutter on the start side, outside the selectable text.
    'after:absolute after:start-1 after:top-0 after:text-muted-foreground after:select-none',
    // Line numbers are a CSS counter, so they are not text: they cannot be selected or copied. The empty alternative
    // text (`/ ''`) also keeps them out of the accessibility tree where the browser supports it.
    'in-data-numbered:col-span-2 in-data-numbered:grid in-data-numbered:grid-cols-subgrid in-data-numbered:gap-x-3 in-data-numbered:[counter-increment:line]',
    'in-data-numbered:before:min-w-6 in-data-numbered:before:text-end in-data-numbered:before:text-muted-foreground in-data-numbered:before:content-[counter(line)] in-data-numbered:before:select-none in-data-numbered:supports-[content:counter(line)_/_""]:before:content-[counter(line)_/_""]',
  ),
  {
    variants: {
      zType: {
        default: '',
        added: 'cn-code-block-line-variant-added',
        removed: 'cn-code-block-line-variant-removed',
        highlighted: 'cn-code-block-line-variant-highlighted',
      },
    },
    defaultVariants: {
      zType: 'default',
    },
  },
);

export type ZardCodeBlockLineTypeVariants = NonNullable<VariantProps<typeof codeBlockLineVariants>['zType']>;

export const codeBlockFooterVariants = cva(
  mergeClasses('cn-code-block-footer flex min-w-0 shrink-0 items-center text-muted-foreground'),
);
