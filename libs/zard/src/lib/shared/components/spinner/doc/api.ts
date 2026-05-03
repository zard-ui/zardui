import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SPINNER_API: ApiSection[] = [
  {
    selector: 'z-spinner',
    description: 'Provides a loading animation.',
    props: [{ name: '[zSize]', description: 'Spinner size', type: 'default | sm | lg', default: 'default' }],
  },
];
