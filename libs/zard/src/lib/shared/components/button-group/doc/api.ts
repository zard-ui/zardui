import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const BUTTON_GROUP_API: ApiSection[] = [
  {
    selector: 'z-button-group',
    description: 'Groups related buttons.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zOrientation]',
        description: 'Layout direction',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
    ],
  },
  {
    selector: 'z-button-group-separator',
    description: 'Divides buttons in a group; not needed for outline buttons.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      {
        name: '[zOrientation]',
        description: 'Overrides the group orientation',
        type: "'horizontal' | 'vertical'",
        default: 'null',
      },
    ],
  },
  {
    selector: '[z-button-group-text]',
    description: 'Styles text, such as a label, to fit the group.',
    props: [{ name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" }],
  },
];
