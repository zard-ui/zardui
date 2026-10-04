import { cva, type VariantProps } from 'class-variance-authority';

export const attachmentVariants = cva(
  'group/attachment relative isolate flex w-fit max-w-full min-w-0 shrink-0 snap-start items-center rounded-2xl border bg-card text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/30 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/50 data-[state=idle]:border-dashed text-sm',
  {
    variants: {
      zState: {
        idle: 'border-border border-dashed',
        uploading: 'border-border bg-muted/50',
        processing: 'border-border bg-muted/50',
        error: 'border-destructive/50 text-destructive',
        done: 'border-border',
      },
      zSize: {
        default: 'gap-3 p-3',
        sm: 'gap-2 p-2.5 text-sm',
        xs: 'gap-1.5 p-2 text-xs rounded-xl',
      },
      zOrientation: {
        horizontal: 'flex-row',
        vertical: 'flex-col items-start',
      },
    },
    defaultVariants: { zState: 'done', zSize: 'default', zOrientation: 'horizontal' },
  },
);

export const attachmentMediaVariants = cva(
  'relative flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive group-data-[size=xs]/attachment:rounded-md [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*="size-"])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*="size-"])]:size-3.5',
  {
    variants: {
      zVariant: {
        icon: 'size-10 bg-muted text-muted-foreground group-data-[size=sm]/attachment:size-8 group-data-[size=xs]/attachment:size-6 [&_svg]:size-4',
        image:
          'size-16 group-data-[size=sm]/attachment:size-12 group-data-[size=xs]/attachment:size-8 [&_img]:size-full [&_img]:object-cover opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover group-data-[orientation=vertical]/attachment:size-auto group-data-[orientation=vertical]/attachment:w-full',
      },
    },
    defaultVariants: { zVariant: 'icon' },
  },
);

export const attachmentContentVariants = cva(
  'flex min-w-0 flex-1 flex-col gap-0.5 leading-tight group-data-[orientation=vertical]/attachment:w-full',
);
export const attachmentTitleVariants = cva('block w-fit max-w-full truncate font-medium');
export const attachmentDescriptionVariants = cva(
  'text-muted-foreground text-xs group-data-[state=error]/attachment:text-destructive/80',
);
export const attachmentActionsVariants = cva(
  'relative z-20 flex shrink-0 items-center gap-1 group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-2.5 group-data-[orientation=vertical]/attachment:right-2.5',
);
export const attachmentActionVariants = cva(
  'relative z-20 group-data-[orientation=vertical]/attachment:bg-background/80 group-data-[orientation=vertical]/attachment:backdrop-blur-xs group-data-[orientation=vertical]/attachment:rounded-full group-data-[orientation=vertical]/attachment:shadow-xs group-data-[orientation=vertical]/attachment:hover:bg-background',
);
export const attachmentTriggerVariants = cva(
  'absolute inset-0 z-10 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-ring',
);
export const attachmentGroupVariants = cva(
  'flex w-full min-w-0 gap-3 overflow-x-auto snap-x snap-mandatory scroll-fade-x scroll-px-1 scrollbar-none py-1 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start',
);

export type ZardAttachmentStateVariants = NonNullable<VariantProps<typeof attachmentVariants>['zState']>;
export type ZardAttachmentSizeVariants = NonNullable<VariantProps<typeof attachmentVariants>['zSize']>;
export type ZardAttachmentOrientationVariants = NonNullable<VariantProps<typeof attachmentVariants>['zOrientation']>;
export type ZardAttachmentMediaVariantVariants = NonNullable<VariantProps<typeof attachmentMediaVariants>['zVariant']>;
