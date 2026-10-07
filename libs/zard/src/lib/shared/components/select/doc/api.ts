import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SELECT_API: ApiSection[] = [
  {
    selector: 'z-select',
    description: 'A customizable select component that supports single and multiple value selection.',
    props: [
      {
        name: '[zValue]',
        description: 'Selected value(s), two-way bindable — a plain `string`, or `string[]` when `zMultiple` is set',
        type: 'string | string[]',
        default: "''",
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zAlign]',
        description: 'Overlay alignment relative to the trigger',
        type: "'start' | 'center' | 'end'",
        default: "'center'",
      },
      { name: '[zDisabled]', description: 'Disables the select', type: 'boolean', default: 'false' },
      {
        name: '[zInvalid]',
        description: 'Applies invalid ARIA state and destructive styling',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zLabel]',
        description: 'Optional manual override for the displayed label',
        type: 'string',
        default: "''",
      },
      {
        name: '[zMaxLabelCount]',
        description:
          'In multiselect mode, how many selected labels render as badges before collapsing the rest into a "N more items selected" badge',
        type: 'number',
        default: '1',
      },
      {
        name: '[zMultiple]',
        description:
          'Turns the select into a multiselect; `zValue` becomes a `string[]` and each pick renders as a `z-badge`',
        type: 'boolean',
        default: 'false',
      },
      {
        name: '[zPlaceholder]',
        description: 'Placeholder text shown when nothing is selected',
        type: 'string',
        default: "'Select an option...'",
      },
      {
        name: '[zPosition]',
        description:
          "Overlay positioning mode: 'item-aligned' opens the listbox so the selected item sits over the trigger; 'popper' drops it from the trigger's edge instead",
        type: "'item-aligned' | 'popper'",
        default: "'item-aligned'",
      },
      { name: '[(zValue)]', description: 'Selected value', type: 'string | string[]', default: "'' | []" },
      {
        name: '(zSelectionChange)',
        description: 'Emitted when the selected value changes',
        type: 'EventEmitter<string | string[]>',
        default: '-',
      },
    ],
  },
  {
    selector: 'z-select-item',
    description: 'Represents an individual item inside a z-select component.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zValue]', description: 'The value associated with this item (required)', type: 'string', default: '-' },
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
