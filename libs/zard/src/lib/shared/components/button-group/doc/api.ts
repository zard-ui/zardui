import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const BUTTON_GROUP_API: ApiSection[] = [
  {
    selector: 'z-button-group',
    description: 'A container that groups related buttons together with consistent styling.',
    props: [
      {
        name: 'zOrientation',
        description: 'Orientation of the button group',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
      },
    ],
  },
  {
    selector: 'z-button-group-divider',
    description: 'A visual divider between buttons in a group.',
    props: [
      {
        name: 'zOrientation',
        description: "Override for divider orientation, by default it uses the parent's orientation",
        type: "'horizontal' | 'vertical'",
        default: 'null',
      },
    ],
  },
  {
    selector: 'z-button-group-text',
    description:
      'Applies styles to text elements so that they conform with the rest of the group, for example a label.',
    props: [],
  },
];
