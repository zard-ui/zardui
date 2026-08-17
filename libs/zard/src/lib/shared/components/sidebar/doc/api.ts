import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const SIDEBAR_API: ApiSection[] = [
  {
    selector: 'z-sidebar',
    description: 'A composable, themeable and customizable sidebar component.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
];
