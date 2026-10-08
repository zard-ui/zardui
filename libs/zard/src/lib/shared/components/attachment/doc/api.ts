import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const ATTACHMENT_API: ApiSection[] = [
  {
    selector: 'z-attachment',
    description: 'File or image container. Consumer projection owns labels, URLs, progress and transport.',
    props: [
      {
        name: '[zState]',
        description: 'Upload state',
        type: 'idle | uploading | processing | error | done',
        default: 'done',
      },
      { name: '[zSize]', description: 'Density', type: 'default | sm | xs', default: 'default' },
      { name: '[zOrientation]', description: 'Layout', type: 'horizontal | vertical', default: 'horizontal' },
      { name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-attachment-media',
    description: 'Projected icon or image. Give images meaningful alt text.',
    props: [
      { name: '[zVariant]', description: 'Media presentation', type: 'icon | image', default: 'icon' },
      { name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-attachment-content',
    description: 'Projected text container.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-attachment-title',
    description: 'Title; shimmers only while the nearest attachment is busy.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-attachment-description',
    description: 'Projected progress or error description; use an aria-live region when appropriate.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-attachment-actions',
    description: 'Independent controls above the full-card trigger.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'button[z-attachment-action]',
    description:
      'Also a[z-attachment-action]. Native actions inherit the complete z-button API and loading observer lifecycle. Native href, target and download remain consumer attributes.',
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
        description: 'Native button type (ignored on anchors)',
        type: 'button | submit | reset',
        default: 'button',
      },
      {
        name: '[tabindex]',
        description: 'Consumer tab order; disabled links use -1',
        type: 'string | number | null',
        default: 'null',
      },
      { name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'button[z-attachment-trigger]',
    description:
      'Also a[z-attachment-trigger]. Project a named native overlay button or link alongside actions, never around them.',
    props: [
      {
        name: '[type]',
        description: 'Native button type (ignored on anchors)',
        type: 'button | submit | reset',
        default: 'button',
      },
      { name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-attachment-group',
    description:
      'Horizontal snapping group. Provide aria-label or aria-labelledby. Host arrow keys scroll one current viewport; descendant controls keep their keys.',
    props: [{ name: '[class]', description: 'Override or extend default classes.', type: 'ClassValue', default: "''" }],
  },
];
