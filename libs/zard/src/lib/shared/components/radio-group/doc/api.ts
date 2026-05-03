import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const RADIO_GROUP_API: ApiSection[] = [
  {
    selector: 'z-radio-group',
    description: 'Wrapper that groups radio items and manages the selected value.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: '[(value)]', description: 'Selected value (two-way binding)', type: 'unknown', default: 'null' },
      { name: '[zDisabled]', description: 'Disables every item in the group', type: 'boolean', default: 'false' },
      { name: '[name]', description: 'Optional name for native form submission', type: 'string', default: "''" },
    ],
  },
  {
    selector: 'z-radio',
    description: 'Individual radio button. Must be a descendant of z-radio-group.',
    props: [
      { name: '[class]', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[value]',
        description: 'Item value, compared against the group value',
        type: 'unknown',
        default: 'null',
      },
      { name: '[zDisabled]', description: 'Disables this item only', type: 'boolean', default: 'false' },
      { name: '[zInvalid]', description: 'Invalid state (sets aria-invalid)', type: 'boolean', default: 'false' },
      { name: '[zId]', description: 'Item id', type: 'string', default: '-' },
    ],
  },
];
