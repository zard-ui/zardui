import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const ACCORDION_API: ApiSection[] = [
  {
    selector: 'z-accordion',
    description: 'A list of collapsible sections.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      {
        name: '[zType]',
        description: 'How many items can be open',
        type: "'single' | 'multiple'",
        default: "'single'",
      },
      { name: '[zCollapsible]', description: 'Allows closing the last open item', type: 'boolean', default: 'true' },
      { name: '[zDefaultValue]', description: 'Items open by default', type: 'string | string[]', default: "''" },
    ],
  },
  {
    selector: 'z-accordion-item',
    description: 'A single accordion section.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zTitle]', description: 'Item title', type: 'string', default: "''" },
      { name: '[zValue]', description: 'Unique item value', type: 'string', default: "''" },
      { name: '[zDisabled]', description: 'Disables the item', type: 'boolean', default: 'false' },
    ],
  },
];
