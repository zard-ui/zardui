import { cva, type VariantProps } from 'class-variance-authority';

export const popoverVariants = cva(
  'z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
);

export const popoverHeaderVariants = cva('flex flex-col gap-0.5 text-sm');

export const popoverTitleVariants = cva('font-medium');

export const popoverDescriptionVariants = cva('text-muted-foreground');

export type ZardPopoverVariants = VariantProps<typeof popoverVariants>;
