import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const COLLAPSIBLE_API: ApiSection[] = [
  {
    selector: 'z-collapsible, [z-collapsible]',
    description: 'Expands and collapses a panel.',
    props: [
      { name: '[zOpen]', description: 'Open state; supports `[(zOpen)]`', type: 'boolean', default: 'false' },
      { name: '[zDisabled]', description: 'Stops the trigger from toggling', type: 'boolean', default: 'false' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '(zOpenChange)',
        description: 'Emitted with the new open state',
        type: 'EventEmitter<boolean>',
        default: '-',
      },
    ],
  },
  {
    selector: '[z-collapsible-trigger]',
    description: 'Toggles the panel; unstyled, apply it to your own button.',
    props: [],
  },
  {
    selector: 'z-collapsible-content',
    description: 'The panel revealed by the trigger.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
];
