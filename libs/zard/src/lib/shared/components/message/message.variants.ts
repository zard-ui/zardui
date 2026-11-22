import { cva } from 'class-variance-authority';

import { mergeClasses } from '@/shared/utils/merge-classes';

export const messageGroupVariants = cva('cn-message-group');

export const messageVariants = cva('cn-message group/message');

export const messageAvatarVariants = cva('cn-message-avatar');

export const messageContentVariants = cva('cn-message-content');

/**
 * A ghost bubble has no surface of its own, so the header and footer drop the
 * padding that would otherwise indent them against it. The `has()` is scoped to
 * the bubble slot on purpose: `z-button` also reflects its type on
 * `data-variant`, and a ghost action button in the footer must not flatten the
 * padding of the whole row.
 */
const messageMetaVariants = 'cn-message-header';

export const messageHeaderVariants = cva(messageMetaVariants);

export const messageFooterVariants = cva(mergeClasses(messageMetaVariants, 'cn-message-footer'));

export type ZardMessageAlignVariants = 'start' | 'end';
