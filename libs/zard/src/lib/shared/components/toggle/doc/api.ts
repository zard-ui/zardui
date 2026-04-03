import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TOGGLE_API: ApiSection[] = [
  {
    selector: '[z-toggle]',
    description: 'A two-state button that can be either on or off.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zSize]', description: 'Toggle size', type: "'sm' | 'md' | 'lg'", default: "'md'" },
      { name: '[zType]', description: 'Visual style', type: "'default' | 'outline'", default: "'default'" },
      { name: '[zValue]', description: 'Toggle value', type: 'boolean', default: 'undefined' },
      {
        name: '[zDefault]',
        description: 'Default value when uncontrolled (used as initial state only)',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[disabled]',
        description: 'Disables the toggle (also integrates with Angular Forms)',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[aria-label]',
        description: 'Accessible label for screen readers (required when using icons only)',
        type: 'string',
        default: "''",
      },
      { name: '(zToggleClick)', description: 'Emitted when the toggle is clicked', type: 'void', default: '-' },
      { name: '(zToggleHover)', description: 'Emitted when the toggle is hovered', type: 'void', default: '-' },
      { name: '(zToggleChange)', description: 'Emitted when the toggle value changes', type: 'boolean', default: '-' },
    ],
  },
];
