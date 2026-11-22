import { cva, type VariantProps } from 'class-variance-authority';

// Structure lives here, the look in the `cn-*` markers (style sheets), the same split as shadcn/ui's attachment.

export const attachmentVariants = cva(
  'cn-attachment group/attachment relative flex max-w-full min-w-0 shrink-0 flex-wrap border bg-card text-card-foreground transition-colors has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed',
  {
    variants: {
      zState: {
        idle: 'cn-attachment-state-idle',
        uploading: 'cn-attachment-state-uploading',
        processing: 'cn-attachment-state-processing',
        error: 'cn-attachment-state-error',
        done: 'cn-attachment-state-done',
      },
      zSize: {
        default: 'cn-attachment-size-default',
        sm: 'cn-attachment-size-sm',
        xs: 'cn-attachment-size-xs',
      },
      zOrientation: {
        horizontal: 'cn-attachment-orientation-horizontal items-center',
        vertical: 'cn-attachment-orientation-vertical flex-col',
      },
    },
    defaultVariants: { zState: 'done', zSize: 'default', zOrientation: 'horizontal' },
  },
);

export const attachmentMediaVariants = cva(
  'cn-attachment-media relative flex aspect-square shrink-0 items-center justify-center overflow-hidden group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive [&_svg]:pointer-events-none',
  {
    variants: {
      zVariant: {
        icon: 'cn-attachment-media-variant-icon',
        image: 'cn-attachment-media-variant-image *:[img]:aspect-square *:[img]:w-full *:[img]:object-cover',
      },
    },
    defaultVariants: { zVariant: 'icon' },
  },
);

export const attachmentContentVariants = cva('cn-attachment-content max-w-full min-w-0 flex-1');
export const attachmentTitleVariants = cva(
  'cn-attachment-title block max-w-full min-w-0 truncate group-data-[state=processing]/attachment:shimmer group-data-[state=uploading]/attachment:shimmer',
);
export const attachmentDescriptionVariants = cva(
  'cn-attachment-description block max-w-full min-w-0 truncate text-muted-foreground group-data-[state=error]/attachment:text-destructive/80',
);
export const attachmentActionsVariants = cva('cn-attachment-actions flex shrink-0 items-center');
export const attachmentActionVariants = cva('cn-attachment-action');
export const attachmentTriggerVariants = cva('cn-attachment-trigger absolute inset-0 z-10 outline-none');
export const attachmentGroupVariants = cva(
  'cn-attachment-group flex min-w-0 scroll-fade-x snap-x snap-mandatory scrollbar-none overflow-x-auto overscroll-x-contain outline-none focus-visible:ring-2 focus-visible:ring-ring *:data-[slot=attachment]:flex-none *:data-[slot=attachment]:snap-start',
);

export type ZardAttachmentStateVariants = NonNullable<VariantProps<typeof attachmentVariants>['zState']>;
export type ZardAttachmentSizeVariants = NonNullable<VariantProps<typeof attachmentVariants>['zSize']>;
export type ZardAttachmentOrientationVariants = NonNullable<VariantProps<typeof attachmentVariants>['zOrientation']>;
export type ZardAttachmentMediaVariantVariants = NonNullable<VariantProps<typeof attachmentMediaVariants>['zVariant']>;
