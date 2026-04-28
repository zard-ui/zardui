import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SELECT_API: ApiSection[] = [
  {
    selector: 'z-select',
    description: 'A customizable select component that supports single and multiple value selection.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zAlign]',
        description: 'Overlay alignment relative to the trigger',
        type: "'start' | 'center' | 'end'",
        default: "'center'",
      },
      {
        name: '[zDir]',
        description: 'Text direction for trigger and content',
        type: "'ltr' | 'rtl' | 'auto'",
        default: "'auto'",
      },
      { name: '[zDisabled]', description: 'Disables the select', type: 'boolean', default: 'false' },
      {
        name: '[zInvalid]',
        description: 'Applies invalid ARIA state and destructive styling',
        type: 'boolean',
        default: 'false',
      },
      { name: '[zLabel]', description: 'Optional label for the select', type: 'string', default: "''" },
      {
        name: '[zMaxLabelCount]',
        description: 'Limits visible labels in multiselect mode',
        type: 'number',
        default: '1',
      },
      { name: '[zMultiple]', description: 'Multiselect mode', type: 'boolean', default: 'false' },
      { name: '[zPlaceholder]', description: 'Placeholder text', type: 'string', default: "'Select an option...'" },
      {
        name: '[zPosition]',
        description: 'Overlay positioning mode',
        type: "'item-aligned' | 'popper'",
        default: "'item-aligned'",
      },
      { name: '[zSize]', description: 'Trigger and item size', type: "'sm' | 'default' | 'lg'", default: "'default'" },
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
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zValue]', description: 'The value associated with this item', type: 'string', default: "''" },
      { name: '[zDisabled]', description: 'Disables selection for this item', type: 'boolean', default: 'false' },
    ],
  },
  {
    selector: 'z-select-group',
    description: 'Groups related select items.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-select-label',
    description: 'Displays a non-selectable label inside a select group.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-select-separator',
    description: 'Displays a separator between select groups.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
];
