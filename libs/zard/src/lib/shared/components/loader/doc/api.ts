import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const LOADER_API: ApiSection[] = [
  {
    selector: 'z-loader',
    description: 'Provides a loading animation.',
    props: [{ name: '[zSize]', description: 'Loader size', type: 'default | sm | lg', default: 'default' }],
  },
];
