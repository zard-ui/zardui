import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const INPUT_API: ApiSection[] = [
  {
    selector: '[z-input]',
    description: 'A directive that accepts all props supported by the native input element.',
    props: [
      { name: '[zSize]', description: 'Input size', type: 'default | sm | lg', default: 'default' },
      { name: '[zStatus]', description: 'Input status', type: 'error | warning | success', default: 'null' },
      { name: '[zBorderless]', description: 'Input without border', type: 'boolean', default: 'false' },
    ],
  },
];
