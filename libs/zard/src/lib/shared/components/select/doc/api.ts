import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SELECT_API: ApiSection[] = [
  {
    selector: 'z-select',
    description: 'Custom select with single or multiple selection.',
    props: [
      {
        name: '[zValue]',
        description: 'Selected value; `string[]` with `zMultiple`',
        type: 'string | string[]',
        default: "''",
      },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zAlign]',
        description: 'Overlay alignment to the trigger',
        type: "'start' | 'center' | 'end'",
        default: "'center'",
      },
      { name: '[zDisabled]', description: 'Disables the select', type: 'boolean', default: 'false' },
      { name: '[zInvalid]', description: 'Invalid state and styling', type: 'boolean', default: 'false' },
      { name: '[zLabel]', description: 'Overrides the displayed label', type: 'string', default: "''" },
      {
        name: '[zMaxLabelCount]',
        description: 'Badges shown before collapsing into "N more"',
        type: 'number',
        default: '1',
      },
      { name: '[zMultiple]', description: 'Enables multiple selection', type: 'boolean', default: 'false' },
      {
        name: '[zPlaceholder]',
        description: 'Shown when nothing is selected',
        type: 'string',
        default: "'Select an option...'",
      },
      {
        name: '[zPosition]',
        description: 'Over the trigger, or dropped from its edge',
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
    description: 'An option of the select.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zValue]', description: 'Item value (required)', type: 'string', default: '-' },
      { name: '[zDisabled]', description: 'Disables this item', type: 'boolean', default: 'false' },
    ],
  },
  {
    selector: 'z-select-group',
    description: 'Groups related select items.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-select-label',
    description: 'Non-selectable group label.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-select-separator',
    description: 'Separator between groups.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
];
