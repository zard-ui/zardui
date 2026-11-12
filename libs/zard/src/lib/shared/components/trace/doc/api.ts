import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const TRACE_API: ApiSection[] = [
  {
    selector: 'z-trace, [z-trace]',
    description: 'A list of rows. It also styles any trigger or link that directly wraps a `z-trace-line`.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-trace-line, [z-trace-line]',
    description:
      'One row. Renders as a span-like box, so it is not a button or a tab stop; wrap it in a trigger or a link to make it do something.',
    props: [
      {
        name: '[zStatus]',
        description: 'Work that is running (shimmering title), failed (destructive) or not started yet (dimmed)',
        type: 'running | error | pending',
        default: '-',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
  {
    selector: 'z-trace-icon, [z-trace-icon]',
    description: 'Decorative icon slot, hidden from assistive tech.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-trace-title, [z-trace-title]',
    description: 'One-line sentence that truncates and shimmers while running. It is the accessible name.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-trace-description, [z-trace-description]',
    description: 'Secondary text such as a count, a duration or diff stats. Does not truncate.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-trace-collapsible, [z-trace-collapsible]',
    description: 'An expandable row, built on `z-collapsible`.',
    props: [
      { name: '[zOpen]', description: 'Open state; supports `[(zOpen)]`', type: 'boolean', default: 'false' },
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
    selector: 'z-trace-collapsible-trigger, [z-trace-collapsible-trigger]',
    description:
      'Wraps its content in a button that toggles the row, with `aria-expanded`, and adds the chevron. `class` styles the button.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-trace-collapsible-content, [z-trace-collapsible-content]',
    description: 'The detail shown when the row is open; its text is muted.',
    props: [
      {
        name: '[zKeepMounted]',
        description: 'Keep the content in the DOM while the row is closed instead of removing it after the collapse',
        type: 'boolean',
        default: 'false',
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
    ],
  },
];
