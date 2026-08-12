import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const HOVER_CARD_API: ApiSection[] = [
  {
    selector: 'z-hover-card',
    description: 'For sighted users to preview content available behind the link.',
    props: [{ name: 'class', description: 'Additional CSS classes', type: 'ClassValue', default: "''" }],
  },
];
