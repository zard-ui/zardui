import { cva, type VariantProps } from 'class-variance-authority';

export const bubbleGroupVariants = cva('cn-bubble-group');

export const bubbleVariants = cva('cn-bubble group/bubble', {
  variants: {
    zVariant: {
      default: 'cn-bubble-variant-default',
      secondary: 'cn-bubble-variant-secondary',
      muted: 'cn-bubble-variant-muted',
      tinted: 'cn-bubble-variant-tinted',
      outline: 'cn-bubble-variant-outline',
      ghost: 'cn-bubble-variant-ghost',
      destructive: 'cn-bubble-variant-destructive',
    },
  },
  defaultVariants: {
    zVariant: 'default',
  },
});

export const bubbleContentVariants = cva('cn-bubble-content');

export const bubbleReactionsVariants = cva('cn-bubble-reactions', {
  variants: {
    zSide: {
      top: 'cn-bubble-reactions-side-top',
      bottom: 'cn-bubble-reactions-side-bottom',
    },
    zAlign: {
      start: 'cn-bubble-reactions-align-start',
      end: 'cn-bubble-reactions-align-end',
    },
  },
  defaultVariants: {
    zSide: 'bottom',
    zAlign: 'end',
  },
});

export type ZardBubbleVariantVariants = NonNullable<VariantProps<typeof bubbleVariants>['zVariant']>;
export type ZardBubbleAlignVariants = 'start' | 'end';
export type ZardBubbleReactionsSideVariants = NonNullable<VariantProps<typeof bubbleReactionsVariants>['zSide']>;
export type ZardBubbleReactionsAlignVariants = NonNullable<VariantProps<typeof bubbleReactionsVariants>['zAlign']>;
