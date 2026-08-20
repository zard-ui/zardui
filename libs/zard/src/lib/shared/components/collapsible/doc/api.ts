import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const COLLAPSIBLE_API: ApiSection[] = [
  {
    selector: 'z-collapsible, [z-collapsible]',
    description:
      'An interactive component which expands and collapses a panel. It renders no markup of its own, so it can also be applied as an attribute to an element that is already a component — for example li[z-sidebar-menu-item].',
    props: [
      {
        name: 'zOpen',
        description: 'Open state of the panel. Supports two-way binding through [(zOpen)]',
        type: 'boolean',
        default: 'false',
      },
      {
        name: 'zDisabled',
        description: 'Blocks the trigger from toggling the panel',
        type: 'boolean',
        default: 'false',
      },
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: 'zOpenChange',
        description: 'Emits the new open state whenever the panel toggles',
        type: 'boolean',
        default: '',
      },
    ],
  },
  {
    selector: '[z-collapsible-trigger]',
    description:
      'Toggles the panel. Apply it to your own button — the directive only wires the behaviour and the ARIA attributes, it does not style anything.',
    props: [],
  },
  {
    selector: 'z-collapsible-content',
    description: 'The panel revealed by the trigger. Animates its height with a CSS grid transition.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
];
