import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TOGGLE_API: ApiSection[] = [
  {
    selector: '[z-toggle]',
    description: 'A two-state button that can be either on or off.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zSize]', description: 'Toggle size', type: "'sm' | 'default' | 'lg'", default: "'default'" },
      { name: '[zType]', description: 'Visual style', type: "'default' | 'outline'", default: "'default'" },
      { name: '[(zValue)]', description: 'Toggle value', type: 'boolean', default: 'false' },
      {
        name: '[zDisabled]',
        description: 'Disables the toggle (also integrates with Angular Forms)',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zAriaLabel]',
        description: 'Accessible label for screen readers (required)',
        type: 'string (required)',
        default: '-',
      },
      { name: '(zToggleClick)', description: 'Emitted when the toggle is clicked', type: 'void', default: '-' },
      { name: '(zToggleHover)', description: 'Emitted when the toggle is hovered', type: 'void', default: '-' },
      { name: '(zToggleChange)', description: 'Emitted when the toggle value changes', type: 'boolean', default: '-' },
    ],
  },
];
