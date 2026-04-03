import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const PROGRESS_BAR_API: ApiSection[] = [
  {
    selector: 'z-progress-bar',
    description:
      'A flexible and customizable progress bar that allows full styling control using class-variance-authority (CVA).',
    props: [
      { name: '[progress]', description: 'Progress percentage (0-100).', type: 'number', default: '0' },
      {
        name: '[zType]',
        description: 'Defines the color variant.',
        type: "'default' | 'destructive' | 'accent'",
        default: "'default'",
      },
      {
        name: '[zSize]',
        description: 'Sets the height of the bar.',
        type: "'default' | 'sm' | 'lg'",
        default: "'default'",
      },
      {
        name: '[zShape]',
        description: 'Defines the border radius style.',
        type: "'default' | 'square'",
        default: "'default'",
      },
      { name: '[zFull]', description: 'Makes the container take full width.', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Custom classes for the container.', type: 'string', default: "''" },
      { name: '[barClass]', description: 'Custom classes for the progress bar.', type: 'string', default: "''" },
      { name: '[zIndeterminate]', description: 'Define loading infinity state.', type: 'boolean', default: 'false' },
    ],
  },
];
