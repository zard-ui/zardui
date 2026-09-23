import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const bubbleGroupVariants = cva('flex min-w-0 flex-col gap-2');

export const bubbleVariants = cva(
  mergeClasses(
    'group/bubble relative flex w-fit min-w-0 max-w-[80%] flex-col gap-1',
    'data-[align=end]:self-end data-[variant=ghost]:max-w-full group-data-[align=end]/message:self-end',
  ),
  {
    variants: {
      zVariant: {
        default: mergeClasses(
          '*:data-[slot=bubble-content]:bg-primary *:data-[slot=bubble-content]:text-primary-foreground',
          '[&>[data-slot=bubble-content]:is(button,a):hover]:bg-primary/80',
        ),
        secondary: mergeClasses(
          '*:data-[slot=bubble-content]:bg-secondary *:data-[slot=bubble-content]:text-secondary-foreground',
          '[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]',
        ),
        muted: mergeClasses(
          '*:data-[slot=bubble-content]:bg-muted',
          '[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)]',
        ),
        tinted: mergeClasses(
          '*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.93_calc(c*0.4)_h)] *:data-[slot=bubble-content]:text-foreground',
          'dark:*:data-[slot=bubble-content]:bg-[oklch(from_var(--primary)_0.3_calc(c*0.4)_h)]',
          '[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.88_calc(c*0.5)_h)]',
          'dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-[oklch(from_var(--primary)_0.35_calc(c*0.5)_h)]',
        ),
        outline: mergeClasses(
          '*:data-[slot=bubble-content]:border-border *:data-[slot=bubble-content]:bg-background',
          '[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground',
          'dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-input/30',
        ),
        ghost: mergeClasses(
          'border-none *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:bg-transparent *:data-[slot=bubble-content]:p-0',
          '[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground',
          'dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-muted/50',
        ),
        destructive: mergeClasses(
          '*:data-[slot=bubble-content]:bg-destructive/10 *:data-[slot=bubble-content]:text-destructive',
          'dark:*:data-[slot=bubble-content]:bg-destructive/20',
          '[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/20',
          'dark:[&>[data-slot=bubble-content]:is(button,a):hover]:bg-destructive/30',
        ),
      },
    },
    defaultVariants: {
      zVariant: 'default',
    },
  },
);

export const bubbleContentVariants = cva(
  mergeClasses(
    'w-fit min-w-0 max-w-full overflow-hidden rounded-3xl border border-transparent px-3 py-2.5 text-sm/relaxed wrap-break-word',
    'group-data-[align=end]/bubble:self-end',
    '[button]:text-left [button,a]:transition-colors [button,a]:outline-none',
    '[button,a]:focus-visible:border-ring [button,a]:focus-visible:ring-3 [button,a]:focus-visible:ring-ring/30',
  ),
);

export const bubbleReactionsVariants = cva(
  'absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-card has-[button]:p-0',
  {
    variants: {
      zSide: {
        top: 'top-0 -translate-y-3/4',
        bottom: 'bottom-0 translate-y-3/4',
      },
      zAlign: {
        start: 'left-3',
        end: 'right-3',
      },
    },
    defaultVariants: {
      zSide: 'bottom',
      zAlign: 'end',
    },
  },
);

export type ZardBubbleVariantVariants = NonNullable<VariantProps<typeof bubbleVariants>['zVariant']>;
export type ZardBubbleAlignVariants = 'start' | 'end';
export type ZardBubbleReactionsSideVariants = NonNullable<VariantProps<typeof bubbleReactionsVariants>['zSide']>;
export type ZardBubbleReactionsAlignVariants = NonNullable<VariantProps<typeof bubbleReactionsVariants>['zAlign']>;
