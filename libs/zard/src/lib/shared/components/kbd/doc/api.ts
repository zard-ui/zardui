import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const KBD_API: ApiSection[] = [
  {
    selector: 'z-kbd',
    description: 'Displays a keyboard key.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
  {
    selector: 'z-kbd-group',
    description: 'Groups z-kbd components together.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
];
