import type { ApiSection } from '@doc/domain/components/api-reference/api-reference.types';

export const ALERT_API: ApiSection[] = [
  {
    selector: 'z-alert',
    description: 'Displays a callout for user attention.',
    props: [
      { name: '[class]', description: 'Custom CSS classes', type: 'ClassValue', default: "''" },
      { name: '[zAction]', description: 'Alert action', type: 'TemplateRef<void>', default: '-' },
      { name: '[zDescription]', description: 'Alert description', type: 'string | TemplateRef<void>', default: '-' },
      {
        name: '[zIcon]',
        description: 'Icon name or template; destructive alerts get one by default',
        type: 'TemplateRef<void> | string',
        default: '-',
      },
      {
        name: '[zRole]',
        description: 'ARIA role; `status` with `zAction`, else `alert`',
        type: "'alert' | 'status'",
        default: '-',
      },
      { name: '[zTitle]', description: 'Alert title', type: 'string | TemplateRef<void>', default: '-' },
      { name: '[zType]', description: 'Alert variant', type: "'default' | 'destructive'", default: "'default'" },
    ],
  },
];
