import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const codeBlockVariants = cva(
  mergeClasses(
    'group/code-block relative flex w-full min-w-0 flex-col overflow-hidden rounded-lg border text-sm',
    'has-[>[data-slot=code-block-content]:focus-visible]:ring-3 has-[>[data-slot=code-block-content]:focus-visible]:ring-ring/50',
  ),
  {
    variants: {
      zType: {
        default:
          'border-input text-foreground dark:bg-input/30 has-[>[data-slot=code-block-content]:focus-visible]:border-ring',
        destructive: 'border-destructive/30 text-destructive dark:border-destructive/40',
      },
      zSize: {
        default: '',
        sm: 'text-xs',
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
    'flex min-w-0 shrink-0 items-center gap-2 px-3 pt-3 text-muted-foreground *:has-[>[data-slot=code-block-title]]:min-w-0',
    'group-data-[variant=destructive]/code-block:text-destructive group-data-[size=sm]/code-block:px-2.5 group-data-[size=sm]/code-block:pt-2.5',
  ),
);

export const codeBlockTitleVariants = cva(
  mergeClasses(
    'min-w-0 truncate font-sans text-sm font-medium text-foreground',
    'group-data-[variant=destructive]/code-block:text-destructive group-data-[size=sm]/code-block:text-xs',
    '[&_ng-icon]:me-1.5 [&_ng-icon]:inline-block [&_ng-icon]:align-middle [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-3.5',
  ),
);

export const codeBlockActionsVariants = cva(
  mergeClasses(
    'ms-auto -my-1 -me-1.5 flex shrink-0 items-center gap-1',
    // Without a header the actions float over the top end of the block until it is hovered or focused.
    '[[data-slot=code-block]>&]:absolute [[data-slot=code-block]>&]:end-2 [[data-slot=code-block]>&]:top-2 [[data-slot=code-block]>&]:z-10 [[data-slot=code-block]>&]:m-0',
    '[[data-slot=code-block]>&]:opacity-0 [[data-slot=code-block]>&]:transition-opacity [[data-slot=code-block]>&]:group-focus-within/code-block:opacity-100 [[data-slot=code-block]>&]:group-hover/code-block:opacity-100 [[data-slot=code-block]>&]:pointer-coarse:opacity-100',
    'group-data-[size=sm]/code-block:[[data-slot=code-block]>&]:end-1.5 group-data-[size=sm]/code-block:[[data-slot=code-block]>&]:top-1.5',
    '[[data-slot=code-block]>&]:**:data-[slot=code-block-copy-button]:bg-background [[data-slot=code-block]>&]:**:data-[slot=code-block-copy-button]:ring-1 [[data-slot=code-block]>&]:**:data-[slot=code-block-copy-button]:ring-foreground/10',
  ),
);

export const codeBlockContentVariants = cva(
  mergeClasses(
    'block min-h-0 min-w-0 scroll-fade-x scrollbar-thin overflow-auto px-3 py-3 text-start font-mono leading-relaxed outline-none',
    'group-has-data-[slot=code-block-header]/code-block:pt-2 group-has-data-[slot=code-block-footer]/code-block:pb-2',
    'group-data-[size=sm]/code-block:px-2.5 group-data-[size=sm]/code-block:py-2.5 group-data-[size=sm]/code-block:group-has-data-[slot=code-block-header]/code-block:pt-1.5',
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
    'relative -mx-3 block min-h-lh px-3 group-data-[size=sm]/code-block:-mx-2.5 group-data-[size=sm]/code-block:px-2.5',
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
        added: 'bg-muted after:content-["+"]',
        removed: 'bg-destructive/10 after:text-destructive after:content-["−"]',
        highlighted: 'bg-muted',
      },
    },
    defaultVariants: {
      zType: 'default',
    },
  },
);

export type ZardCodeBlockLineTypeVariants = NonNullable<VariantProps<typeof codeBlockLineVariants>['zType']>;

export const codeBlockFooterVariants = cva(
  mergeClasses(
    'flex min-w-0 shrink-0 items-center gap-2 px-3 pb-3 text-muted-foreground',
    'group-data-[size=sm]/code-block:px-2.5 group-data-[size=sm]/code-block:pb-2.5',
  ),
);
