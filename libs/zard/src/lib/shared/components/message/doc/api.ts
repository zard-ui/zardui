import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const MESSAGE_API: ApiSection[] = [
  {
    selector: 'z-message',
    description:
      'The message row wrapper. It owns the avatar, alignment, header and footer around the message surface.',
    props: [
      {
        name: '[zAlign]',
        description: 'The alignment of the message in the conversation.',
        type: 'start | end',
        default: 'start',
      },
      {
        name: '[zSrc]',
        description:
          'Avatar image of the sender. Renders the avatar slot for you; a projected z-message-avatar wins over it.',
        type: 'string | SafeUrl',
        default: '-',
      },
      {
        name: '[zAlt]',
        description: 'Alternative text of the shorthand avatar image.',
        type: 'string',
        default: '-',
      },
      {
        name: '[zFallback]',
        description: 'Initials shown while the shorthand avatar has no image, or instead of one.',
        type: 'string',
        default: '-',
      },
      {
        name: '[zHeader]',
        description: 'Content above the turn, such as a sender name. Only applies to the shorthand.',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[zFooter]',
        description: 'Content below the turn, such as a delivery status. Only applies to the shorthand.',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[zVariant]',
        description: 'Variant of the bubble the shorthand renders. Ignored once the content is projected.',
        type: 'default | secondary | muted | tinted | outline | ghost | destructive',
        default: 'default',
      },
      {
        name: '[class]',
        description: 'Additional classes to apply to the row.',
        type: 'ClassValue',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-message-avatar',
    description:
      'The avatar slot, aligned to the bottom of the message. When the message has a z-message-footer, the avatar shifts up to stay aligned with the message surface instead of the footer.',
    props: [
      {
        name: '[class]',
        description: 'Additional classes to apply to the avatar slot.',
        type: 'ClassValue',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-message-content',
    description: 'Wraps the header, message surface and footer.',
    props: [
      {
        name: '[class]',
        description: 'Additional classes to apply to the content slot.',
        type: 'ClassValue',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-message-header',
    description:
      'Displays content above the message, such as a sender name. Stays aligned to the start regardless of zAlign.',
    props: [
      {
        name: '[zHeader]',
        description: 'Header content, as an alternative to projecting it.',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[class]',
        description: 'Additional classes to apply to the header.',
        type: 'ClassValue',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-message-footer',
    description: 'Displays content below the message, such as status or actions. Aligns to the message side.',
    props: [
      {
        name: '[zFooter]',
        description: 'Footer content, as an alternative to projecting it.',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[class]',
        description: 'Additional classes to apply to the footer.',
        type: 'ClassValue',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-message-group',
    description: 'Groups consecutive messages from the same sender.',
    props: [
      {
        name: '[class]',
        description: 'Additional classes to apply to the group root.',
        type: 'ClassValue',
        default: '-',
      },
    ],
  },
];
