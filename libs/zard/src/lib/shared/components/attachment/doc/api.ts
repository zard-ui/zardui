import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const ATTACHMENT_API: ApiSection[] = [
  {
    selector: 'z-attachment',
    description: 'File or image container; you project labels, links and progress.',
    props: [
      {
        name: '[zState]',
        description: 'Upload state',
        type: 'idle | uploading | processing | error | done',
        default: 'done',
      },
      { name: '[zSize]', description: 'Density', type: 'default | sm | xs', default: 'default' },
      { name: '[zOrientation]', description: 'Layout', type: 'horizontal | vertical', default: 'horizontal' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-attachment-media',
    description: 'Icon or image; give images alt text.',
    props: [
      { name: '[zVariant]', description: 'Media presentation', type: 'icon | image', default: 'icon' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-attachment-content',
    description: 'Text container.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-attachment-title',
    description: 'Title; shimmers while the attachment is busy.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-attachment-description',
    description: 'Progress or error text.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-attachment-actions',
    description: 'Controls layered above the card trigger.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'button[z-attachment-action]',
    description: 'Action button with the full `z-button` API.',
    props: [
      {
        name: '[zType]',
        description: 'Button appearance',
        type: 'default | destructive | outline | secondary | ghost | link',
        default: 'ghost',
      },
      {
        name: '[zSize]',
        description: 'Button size',
        type: 'default | xs | sm | lg | icon | icon-xs | icon-sm | icon-lg',
        default: 'icon-xs',
      },
      { name: '[zShape]', description: 'Button shape', type: 'default | circle | square', default: 'default' },
      { name: '[zLoading]', description: 'Loading indicator', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Disabled state', type: 'boolean', default: 'false' },
      { name: '[disabled]', description: 'Native disabled state', type: 'boolean', default: 'false' },
      {
        name: '[type]',
        description: 'Native button type; ignored on anchors',
        type: 'button | submit | reset',
        default: 'button',
      },
      {
        name: '[tabindex]',
        description: 'Tab order; disabled links use -1',
        type: 'string | number | null',
        default: 'null',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'button[z-attachment-trigger]',
    description: 'Full-card button or link; place it beside actions, not around them.',
    props: [
      {
        name: '[type]',
        description: 'Native button type; ignored on anchors',
        type: 'button | submit | reset',
        default: 'button',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-attachment-group',
    description: 'Horizontal snapping group; give it an `aria-label`.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
];
