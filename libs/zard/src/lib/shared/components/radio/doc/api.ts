import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const RADIO_API: ApiSection[] = [
  {
    selector: 'z-radio',
    description: 'A control that allows the user to select one option from a set of options.',
    props: [
      { name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" },
      { name: 'zDisabled', description: 'Whether the radio is disabled', type: 'boolean', default: 'false' },
      { name: 'name', description: 'Name attribute for the radio group', type: 'string', default: "'radio'" },
      { name: 'zId', description: 'ID attribute for the radio', type: 'string', default: 'auto-generated' },
      { name: 'value', description: 'Value of the radio button', type: 'unknown', default: 'null' },
      {
        name: 'radioChange',
        description: 'Emits when radio selection changes',
        type: 'EventEmitter<boolean>',
        default: '',
      },
    ],
  },
];
