import { cva, type VariantProps } from 'class-variance-authority';

import { buttonVariants } from '@/shared/components/button/button.variants';
import { mergeClasses } from '@/shared/utils/merge-classes';

/** The frame. It fills its parent, so give it (or the parent) a height. */
export const messageScrollerVariants = cva(
  'group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden',
);

/**
 * `overflow-anchor: none` is deliberate: the scroller keeps the visible row stable itself (see
 * `zPreserveScrollOnPrepend`), and the browser's own scroll anchoring would compensate a second time.
 * `scroll-fade-b` (from `utilities.css`) fades the bottom edge while there is more content below.
 */
export const messageScrollerViewportVariants = cva(
  mergeClasses(
    'size-full min-h-0 min-w-0 scroll-fade-b scrollbar-thin overflow-y-auto overscroll-contain [overflow-anchor:none] [scrollbar-gutter:stable]',
    'focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none focus-visible:ring-inset',
    'data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent',
    'data-pending-scroll:invisible',
  ),
);

export const messageScrollerContentVariants = cva('flex h-max min-h-full flex-col gap-6 p-4');

export const messageScrollerItemVariants = cva('min-w-0 shrink-0');

export const messageScrollerButtonVariants = cva(
  mergeClasses(
    buttonVariants({ zType: 'secondary', zSize: 'icon-sm' }),
    'absolute start-1/2 -translate-x-1/2 border-border bg-background text-foreground transition-[translate,scale,opacity] duration-200 hover:bg-muted hover:text-foreground rtl:translate-x-1/2',
    'data-[active=false]:pointer-events-none data-[active=false]:scale-95 data-[active=false]:opacity-0 data-[active=false]:duration-400 data-[active=false]:ease-[cubic-bezier(0.7,0,0.84,0)]',
    'data-[active=true]:translate-y-0 data-[active=true]:scale-100 data-[active=true]:opacity-100 data-[active=true]:ease-[cubic-bezier(0.23,1,0.32,1)]',
  ),
  {
    variants: {
      zDirection: {
        end: 'bottom-4 data-[active=false]:translate-y-full',
        start: 'top-4 data-[active=false]:-translate-y-full [&_svg]:rotate-180',
      },
    },
    defaultVariants: {
      zDirection: 'end',
    },
  },
);

export type ZardMessageScrollerDirectionVariants = NonNullable<
  VariantProps<typeof messageScrollerButtonVariants>['zDirection']
>;
