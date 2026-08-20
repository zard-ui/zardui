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
