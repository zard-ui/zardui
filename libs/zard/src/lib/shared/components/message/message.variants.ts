import { cva } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const messageGroupVariants = cva('flex min-w-0 flex-col gap-2');

export const messageVariants = cva(
  mergeClasses('group/message relative flex w-full min-w-0 gap-2 text-sm', 'data-[align=end]:flex-row-reverse'),
);

export const messageAvatarVariants = cva(
  mergeClasses(
    'flex w-fit min-w-8 shrink-0 items-center justify-center self-end overflow-hidden rounded-full bg-muted',
    'group-has-data-[slot=message-footer]/message:-translate-y-8',
  ),
);

export const messageContentVariants = cva(
  mergeClasses(
    'flex w-full min-w-0 flex-col gap-2.5 wrap-break-word',
    'group-data-[align=end]/message:*:data-slot:self-end',
  ),
);

/**
 * A ghost bubble has no surface of its own, so the header and footer drop the
 * padding that would otherwise indent them against it. The `has()` is scoped to
 * the bubble slot on purpose: `z-button` also reflects its type on
 * `data-variant`, and a ghost action button in the footer must not flatten the
 * padding of the whole row.
 */
const messageMetaVariants = mergeClasses(
  'flex max-w-full min-w-0 items-center px-3 text-xs font-medium text-muted-foreground',
  'group-has-[[data-slot=bubble][data-variant=ghost]]/message:px-0',
);

export const messageHeaderVariants = cva(messageMetaVariants);

export const messageFooterVariants = cva(
  mergeClasses(messageMetaVariants, 'group-data-[align=end]/message:justify-end'),
);

export type ZardMessageAlignVariants = 'start' | 'end';
