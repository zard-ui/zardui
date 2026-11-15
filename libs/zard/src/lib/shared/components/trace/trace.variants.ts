import { cva, type VariantProps } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

/**
 * The list. Besides stacking its rows it styles any trigger or link that directly wraps a
 * `z-trace-line` (an `<a>`, a `<button>`...), so the line itself never has to know what it is wrapped in.
 */
export const traceVariants = cva(
  mergeClasses(
    'flex w-full min-w-0 flex-col gap-2',
    '*:has-[>[data-slot=trace-line]]:flex *:has-[>[data-slot=trace-line]]:w-fit *:has-[>[data-slot=trace-line]]:max-w-full *:has-[>[data-slot=trace-line]]:min-w-0',
    '*:has-[>[data-slot=trace-line]]:rounded-md *:has-[>[data-slot=trace-line]]:text-start *:has-[>[data-slot=trace-line]]:outline-none',
    '*:has-[>[data-slot=trace-line]]:focus-visible:ring-3 *:has-[>[data-slot=trace-line]]:focus-visible:ring-ring/50',
  ),
);

export const traceLineVariants = cva(
  mergeClasses(
    'flex w-fit max-w-full min-w-0 items-center gap-2 text-sm text-muted-foreground transition-colors',
    'in-[a,button]:cursor-pointer in-[a:hover,button:hover]:text-foreground',
  ),
  {
    variants: {
      zStatus: {
        // `shimmer` comes from utilities.css; the title opts out with `motion-reduce:shimmer-none`.
        running: '*:data-[slot=trace-title]:shimmer',
        error: 'text-destructive in-[a:hover,button:hover]:text-destructive',
        pending: 'opacity-60',
      },
    },
  },
);

export const traceIconVariants = cva(
  mergeClasses(
    'flex size-4 shrink-0 items-center justify-center [--ng-icon__size:1rem] [&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-4',
    // A trailing icon (a chevron, an "opens in a new tab" arrow) tucks in toward the title.
    '[[data-slot=trace-title]~&]:-ms-1',
  ),
);

export const traceTitleVariants = cva('min-w-0 truncate motion-reduce:shimmer-none');

export const traceDescriptionVariants = cva('shrink-0 text-muted-foreground tabular-nums');

export const traceCollapsibleVariants = cva('flex w-full min-w-0 flex-col');

export const traceCollapsibleTriggerVariants = cva(
  mergeClasses(
    'group/trace-collapsible-trigger flex w-fit max-w-full min-w-0 cursor-pointer items-center gap-1 rounded-md text-start text-muted-foreground transition-colors outline-none',
    'hover:text-foreground has-[[data-status=error]]:text-destructive focus-visible:ring-3 focus-visible:ring-ring/50',
  ),
);

/** Turns the right-pointing chevron down when open, and mirrors it in RTL so it still points inline-end. */
export const traceChevronVariants = cva(
  mergeClasses(
    'transition-transform rtl:-scale-x-100',
    'group-aria-expanded/trace-collapsible-trigger:rotate-90 rtl:group-aria-expanded/trace-collapsible-trigger:-rotate-90',
  ),
);

export const traceCollapsibleContentVariants = cva(
  'mt-2 mb-1 ms-[calc(--spacing(2)-1px)] min-w-0 border-s ps-4 pe-1 leading-relaxed wrap-break-word text-muted-foreground',
);

export type ZardTraceStatusVariants = NonNullable<VariantProps<typeof traceLineVariants>['zStatus']>;
