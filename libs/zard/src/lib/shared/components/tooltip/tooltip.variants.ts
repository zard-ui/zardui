import { cva, type VariantProps } from 'class-variance-authority';

export const tooltipVariants = cva(
  'z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
);
export type ZardTooltipVariants = VariantProps<typeof tooltipVariants>;

export const tooltipPositionVariants = cva('absolute', {
  variants: {
    position: {
      top: 'bottom-0 translate-y-full left-[calc(50%-5px)]',
      bottom: '-top-2.5 translate-y-0 rotate-180 left-[calc(50%-5px)]',
      left: 'top-[calc(50%-5px)] rotate-270 translate-y-0 -right-2.5',
      right: 'top-[calc(50%-5px)] translate-y-0 rotate-90 -left-2.5',
    },
  },
});

export type ZardTooltipPositionVariants = NonNullable<VariantProps<typeof tooltipPositionVariants>['position']>;
