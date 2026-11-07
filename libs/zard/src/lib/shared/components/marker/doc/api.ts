import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const MARKER_API: ApiSection[] = [
  {
    selector: 'z-marker',
    description: 'Root of an inline conversation marker; bare projected content gets the content surface.',
    props: [
      {
        name: '[zVariant]',
        description: 'Layout of the marker',
        type: 'default | border | separator',
        default: 'default',
      },
      {
        name: '[zIcon]',
        description: '`@ng-icons` name or template. Ignored with `z-marker-icon`',
        type: 'string | TemplateRef<void>',
        default: '-',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' },
    ],
  },
  {
    selector: 'z-marker-icon',
    description: 'Decorative icon slot, for component icons such as `z-spinner`.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
  {
    selector: 'z-marker-content',
    description: 'Optional text surface; project it to add classes such as `shimmer`.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: '-' }],
  },
];
