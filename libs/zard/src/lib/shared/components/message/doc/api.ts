import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const MESSAGE_API: ApiSection[] = [
  {
    selector: 'z-message',
    description: 'Message row with avatar, header and footer.',
    props: [
      { name: '[zAlign]', description: 'Side of the conversation', type: 'start | end', default: 'start' },
      {
        name: '[zSrc]',
        description: 'Sender avatar image; a projected avatar overrides it',
        type: 'string | SafeUrl',
        default: '-',
      },
      { name: '[zAlt]', description: 'Avatar alt text', type: 'string', default: '-' },
      { name: '[zFallback]', description: 'Avatar initials when there is no image', type: 'string', default: '-' },
      {
        name: '[zHeader]',
        description: 'Content above the message, e.g. sender name',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[zFooter]',
        description: 'Content below the message, e.g. delivery status',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      {
        name: '[zVariant]',
        description: 'Bubble variant; ignored when content is projected',
        type: 'default | secondary | muted | tinted | outline | ghost | destructive',
        default: 'default',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: 'z-message-avatar',
    description: 'Avatar slot, aligned to the bottom of the message surface.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-message-content',
    description: 'Wraps the header, message surface and footer.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-message-header',
    description: 'Content above the message, always start-aligned.',
    props: [
      {
        name: '[zHeader]',
        description: 'Header content, instead of projecting it',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: 'z-message-footer',
    description: 'Content below the message, aligned to its side.',
    props: [
      {
        name: '[zFooter]',
        description: 'Footer content, instead of projecting it',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: 'z-message-group',
    description: 'Groups consecutive messages from the same sender.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
];
