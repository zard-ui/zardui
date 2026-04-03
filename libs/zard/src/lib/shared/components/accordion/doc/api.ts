import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const ACCORDION_API: ApiSection[] = [
  {
    selector: 'z-accordion',
    description: 'A component that displays a list of collapsible content sections.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      {
        name: '[zType]',
        description: 'Single or multiple items can be opened',
        type: "'single' | 'multiple'",
        default: "'single'",
      },
      {
        name: '[zCollapsible]',
        description: 'Whether accordion items can be collapsed',
        type: 'boolean',
        default: 'true',
      },
      {
        name: '[zDefaultValue]',
        description: "Item value(s) of the accordion's item(s) to be opened by default",
        type: 'string | string[]',
        default: "''",
      },
    ],
  },
  {
    selector: 'z-accordion-item',
    description: 'Represents a single section in the accordion.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zTitle]', description: 'The title for item header', type: 'string', default: "''" },
      { name: '[zValue]', description: 'Unique value of the accordion item', type: 'string', default: "''" },
      { name: '[zDisabled]', description: 'Accordion disabled state', type: 'boolean', default: 'false' },
    ],
  },
];
