import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const ITEM_API: ApiSection[] = [
  {
    selector: 'z-item',
    description: 'An entry made of media, content and actions.',
    props: [
      { name: '[zVariant]', description: 'Visual variant', type: 'default | outline | muted', default: 'default' },
      { name: '[zSize]', description: 'Padding and density', type: 'default | sm | xs', default: 'default' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: 'z-item-group',
    description: 'Groups items with consistent spacing.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-item-separator',
    description: 'Separator between items in a group.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-item-media',
    description: 'Leading icon, image or media.',
    props: [
      { name: '[zVariant]', description: 'Media presentation', type: 'default | icon | image', default: 'default' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: 'z-item-content',
    description: 'Main content; wraps title and description.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-item-title',
    description: 'Primary heading for the item.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-item-description',
    description: 'Supporting copy below the title.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-item-actions',
    description: 'Container for trailing buttons or controls.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-item-header',
    description: 'Header row at the top of the item.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-item-footer',
    description: 'Footer row at the bottom of the item.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
];
