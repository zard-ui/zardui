import { cva, type VariantProps } from 'class-variance-authority';

export const attachmentVariants = cva('cn-attachment group/attachment', {
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
      horizontal: 'cn-attachment-orientation-horizontal',
      vertical: 'cn-attachment-orientation-vertical',
    },
  },
  defaultVariants: { zState: 'done', zSize: 'default', zOrientation: 'horizontal' },
});

export const attachmentMediaVariants = cva('cn-attachment-media [&_svg]:pointer-events-none', {
  variants: {
    zVariant: {
      icon: 'cn-attachment-media-variant-icon',
      image: 'cn-attachment-media-variant-image',
    },
  },
  defaultVariants: { zVariant: 'icon' },
});

export const attachmentContentVariants = cva('cn-attachment-content');
export const attachmentTitleVariants = cva('cn-attachment-title');
export const attachmentDescriptionVariants = cva('cn-attachment-description');
export const attachmentActionsVariants = cva('cn-attachment-actions');
export const attachmentActionVariants = cva('cn-attachment-action');
export const attachmentTriggerVariants = cva('cn-attachment-trigger');
export const attachmentGroupVariants = cva('cn-attachment-group scroll-fade-x outline-none');

export type ZardAttachmentStateVariants = NonNullable<VariantProps<typeof attachmentVariants>['zState']>;
export type ZardAttachmentSizeVariants = NonNullable<VariantProps<typeof attachmentVariants>['zSize']>;
export type ZardAttachmentOrientationVariants = NonNullable<VariantProps<typeof attachmentVariants>['zOrientation']>;
export type ZardAttachmentMediaVariantVariants = NonNullable<VariantProps<typeof attachmentMediaVariants>['zVariant']>;
