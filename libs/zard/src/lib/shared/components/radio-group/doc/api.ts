import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const RADIO_GROUP_API: ApiSection[] = [
  {
    selector: 'z-radio-group',
    description: 'Groups radio items and holds the selected value.',
    props: [
      { name: '[value]', description: 'Item value', type: 'unknown', default: 'null' },
      { name: '[(value)]', description: 'Selected value', type: 'unknown', default: 'null' },
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zDisabled]', description: 'Disables every item', type: 'boolean', default: 'false' },
      { name: '[name]', description: 'Name for native form submission', type: 'string', default: "''" },
    ],
  },
  {
    selector: 'z-radio',
    description: 'A radio button inside `z-radio-group`.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[value]',
        description: 'Item value, compared against the group value',
        type: 'unknown',
        default: 'null',
      },
      { name: '[zDisabled]', description: 'Disables this item only', type: 'boolean', default: 'false' },
      { name: '[zInvalid]', description: 'Sets `aria-invalid`', type: 'boolean', default: 'false' },
      { name: '[zId]', description: 'Item id', type: 'string', default: '-' },
    ],
  },
];
