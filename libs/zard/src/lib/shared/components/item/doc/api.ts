import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const ITEM_API: ApiSection[] = [
  {
    selector: 'z-item',
    description: 'Container for an entry composed of media, content, and actions.',
    props: [
      {
        name: '[zVariant]',
        description: 'Visual style of the item.',
        type: 'default | outline | muted',
        default: 'default',
      },
      { name: '[zSize]', description: 'Padding and density.', type: 'default | sm | xs', default: 'default' },
      { name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: 'z-item-group',
    description: 'Wrapper around multiple items with consistent spacing.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-item-separator',
    description: 'Horizontal separator rendered between items in a group.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-item-media',
    description: 'Slot for an icon, image, or custom media at the leading edge of the item.',
    props: [
      { name: '[zVariant]', description: 'Media presentation.', type: 'default | icon | image', default: 'default' },
      { name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: 'z-item-content',
    description: 'Main text/content area; usually wraps title and description.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-item-title',
    description: 'Primary heading for the item.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-item-description',
    description: 'Supporting copy below the title.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-item-actions',
    description: 'Container for trailing buttons or controls.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-item-header',
    description: 'Optional header row rendered at the top of the item.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-item-footer',
    description: 'Optional footer row rendered at the bottom of the item.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: '-' }],
  },
];
