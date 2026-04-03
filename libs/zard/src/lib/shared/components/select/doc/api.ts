import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SELECT_API: ApiSection[] = [
  {
    selector: 'z-select',
    description: 'A customizable select component that allows single value selection.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zDisabled]', description: 'Disables the select', type: 'boolean', default: 'false' },
      { name: '[zLabel]', description: 'Optional label for the select', type: 'string', default: "''" },
      {
        name: '[zMaxLabelCount]',
        description: 'Limits visible labels in multiselect mode',
        type: 'number',
        default: '1',
      },
      { name: '[zMultiple]', description: 'Multiselect mode', type: 'boolean', default: 'false' },
      { name: '[zPlaceholder]', description: 'Placeholder text', type: 'string', default: "'Select an option...'" },
      { name: '[(zValue)]', description: 'Selected value', type: 'string | string[]', default: "'' | []" },
      {
        name: '(zSelectionChange)',
        description: 'Emitted when the selected value changes',
        type: 'string | string[]',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-select-item',
    description: 'Represents an individual item inside a z-select component.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'string', default: "''" },
      { name: '[zValue]', description: 'The value associated with this item', type: 'string', default: "''" },
      { name: '[zDisabled]', description: 'Disables selection for this item', type: 'boolean', default: 'false' },
    ],
  },
];
